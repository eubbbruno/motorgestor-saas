import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { generateWhatsAppResponse } from "@/lib/ai/claude";
import { sendTextMessage } from "@/lib/whatsapp/evolution-go";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Log full body — sem truncar, para ver o formato real do Evolution GO
  console.log("[webhook] body completo:", JSON.stringify(body));

  try {
    // ── Filtro de evento ────────────────────────────────────────────────────
    const event: string = body?.event ?? body?.type ?? "";
    console.log("[webhook] event:", event);

    if (event !== "messages.upsert") {
      console.log("[webhook] ignorado — event não é messages.upsert, recebido:", event);
      return NextResponse.json({ ok: true });
    }

    // ── Extração de campos ──────────────────────────────────────────────────
    const instanceName: string = body?.instance ?? body?.instanceName ?? "";
    const remoteJid: string =
      body?.data?.key?.remoteJid ??
      body?.data?.remoteJid ??
      "";
    const text: string =
      body?.data?.message?.conversation ??
      body?.data?.message?.extendedTextMessage?.text ??
      body?.data?.body ??
      "";

    console.log("[webhook] instanceName:", instanceName);
    console.log("[webhook] remoteJid:", remoteJid);
    console.log("[webhook] text:", text);

    if (!instanceName) {
      console.log("[webhook] abortado — instanceName vazio");
      return NextResponse.json({ ok: true });
    }
    if (!remoteJid) {
      console.log("[webhook] abortado — remoteJid vazio");
      return NextResponse.json({ ok: true });
    }
    if (!text) {
      console.log("[webhook] abortado — text vazio (possivelmente mídia ou outro tipo)");
      return NextResponse.json({ ok: true });
    }
    if (remoteJid.endsWith("@g.us") || remoteJid === "status@broadcast") {
      console.log("[webhook] ignorado — grupo ou broadcast:", remoteJid);
      return NextResponse.json({ ok: true });
    }

    const from = remoteJid.replace("@s.whatsapp.net", "");
    console.log("[webhook] from (sem sufixo):", from);

    // ── Supabase ────────────────────────────────────────────────────────────
    const db = createSupabaseServiceClient();
    if (!db) {
      console.error("[webhook] Supabase service client não disponível");
      return NextResponse.json({ ok: true });
    }

    const { data: company, error: companyErr } = await db
      .from("companies")
      .select("id")
      .eq("whatsapp_instance_name", instanceName)
      .single();

    console.log("[webhook] company lookup:", company?.id ?? null, "| error:", companyErr?.message ?? null);

    if (!company?.id) {
      console.log("[webhook] abortado — nenhuma empresa com whatsapp_instance_name =", instanceName);
      return NextResponse.json({ ok: true });
    }

    const companyId = company.id;

    // Upsert conversation
    const { data: conversation, error: convErr } = await db
      .from("whatsapp_conversations")
      .upsert(
        {
          company_id: companyId,
          contact_phone: from,
          last_message: text,
          last_message_at: new Date().toISOString(),
          status: "open",
        },
        { onConflict: "company_id,contact_phone" },
      )
      .select()
      .single();

    console.log("[webhook] upsert conversation:", conversation?.id ?? null, "| error:", convErr?.message ?? null);

    if (!conversation) {
      console.error("[webhook] abortado — falha no upsert de conversa");
      return NextResponse.json({ ok: true });
    }

    // Save inbound message
    const { error: msgErr } = await db.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      company_id: companyId,
      direction: "inbound",
      message: text,
      sent_by: "human",
      wa_message_id: body?.data?.key?.id ?? null,
    });

    console.log("[webhook] insert message:", msgErr ? `ERRO: ${msgErr.message}` : "ok");

    // Update unread count
    await db
      .from("whatsapp_conversations")
      .update({ unread_count: (conversation.unread_count ?? 0) + 1 })
      .eq("id", conversation.id);

    // ── IA ──────────────────────────────────────────────────────────────────
    const { data: training } = await db
      .from("ai_training")
      .select("*")
      .eq("company_id", companyId)
      .single();

    console.log("[webhook] ai_enabled:", training?.ai_enabled ?? false);

    if (!training?.ai_enabled) return NextResponse.json({ ok: true });

    const { data: history } = await db
      .from("whatsapp_messages")
      .select("direction, message")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: vehicles } = await db
      .from("vehicles")
      .select("title, make, model, year, price, color, mileage, status")
      .eq("company_id", companyId)
      .eq("status", "disponivel")
      .limit(20);

    const aiResponse = await generateWhatsAppResponse(
      text,
      (history ?? []).reverse(),
      training,
      vehicles ?? [],
    );

    console.log("[webhook] aiResponse gerado:", aiResponse ? `${aiResponse.slice(0, 80)}...` : "null");

    if (!aiResponse) return NextResponse.json({ ok: true });

    const delayMin = training.response_delay_min ?? 3;
    const delayMax = training.response_delay_max ?? 8;
    const delay = (delayMin + Math.random() * (delayMax - delayMin)) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const sendResult = await sendTextMessage(instanceName, remoteJid, aiResponse);
    console.log("[webhook] sendTextMessage result:", JSON.stringify(sendResult));

    await db.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      company_id: companyId,
      direction: "outbound",
      message: aiResponse,
      sent_by: "ai",
      wa_message_id: sendResult?.key?.id ?? null,
    });

    await db
      .from("whatsapp_conversations")
      .update({
        last_message: aiResponse,
        last_message_at: new Date().toISOString(),
        unread_count: 0,
      })
      .eq("id", conversation.id);

    console.log("[webhook] concluído com sucesso");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook] erro inesperado:", err);
    return NextResponse.json({ ok: true }); // sempre 200 para o Evolution GO
  }
}
