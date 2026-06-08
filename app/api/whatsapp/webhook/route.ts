import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { generateWhatsAppResponse } from "@/lib/ai/claude";
import { sendTextMessage } from "@/lib/whatsapp/evolution-go";

export async function GET() {
  return NextResponse.json({ ok: true });
}

// Remove qualquer sufixo @dominio de um JID (suporta @s.whatsapp.net, @lid, @c.us, etc.)
function extractPhone(jid: string): string {
  return jid.replace(/@.*$/, "");
}

// Retorna true apenas para grupos (JIDs que terminam em @g.us)
function isGroup(jid: string): boolean {
  return jid.endsWith("@g.us");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Log completo — sem filtrar nada, para diagnóstico de formato
  console.log("[webhook] body completo:", JSON.stringify(body));

  // Log todos os campos candidatos a instanceName para identificar o correto
  console.log("[webhook] campos de instância no payload —",
    "instance:", body?.instance,
    "| instanceName:", body?.instanceName,
    "| instanceId:", body?.instanceId,
    "| sender:", body?.sender,
  );

  try {
    // ── Filtro de evento ────────────────────────────────────────────────────
    const eventName: string = body?.event ?? body?.type ?? "";
    console.log("[webhook] event:", eventName);

    const isMessage =
      eventName === "messages.upsert" ||
      eventName === "Message" ||
      eventName === "message" ||
      eventName === "messages";

    if (!isMessage) {
      console.log("[webhook] ignorado — event:", eventName);
      return NextResponse.json({ ok: true });
    }

    // ── Extração do instanceName — tenta todos os campos possíveis ──────────
    const instanceName: string =
      body?.instance ??
      body?.instanceName ??
      body?.instanceId ??
      body?.data?.instanceName ??
      "";

    // ── Extração do remoteJid — aceita qualquer formato ─────────────────────
    const remoteJid: string =
      body?.data?.key?.remoteJid ??
      body?.data?.remoteJid ??
      "";

    // ── Extração do texto — múltiplos formatos Evolution GO ─────────────────
    const text: string =
      body?.data?.message?.conversation ??
      body?.data?.message?.extendedTextMessage?.text ??
      body?.data?.message?.imageMessage?.caption ??
      body?.data?.body ??
      "";

    console.log("[webhook] instanceName extraído:", instanceName);
    console.log("[webhook] remoteJid:", remoteJid, "| formato:", remoteJid.includes("@lid") ? "LID" : remoteJid.includes("@s.whatsapp.net") ? "JID" : "outro");
    console.log("[webhook] text:", text || "(vazio)");

    if (!instanceName) {
      console.log("[webhook] abortado — instanceName vazio em todos os campos");
      return NextResponse.json({ ok: true });
    }
    if (!remoteJid) {
      console.log("[webhook] abortado — remoteJid vazio");
      return NextResponse.json({ ok: true });
    }
    if (!text) {
      console.log("[webhook] abortado — mensagem sem texto (mídia, sticker, etc.)");
      return NextResponse.json({ ok: true });
    }
    if (isGroup(remoteJid) || remoteJid === "status@broadcast") {
      console.log("[webhook] ignorado — grupo ou broadcast:", remoteJid);
      return NextResponse.json({ ok: true });
    }

    // Extrai o identificador do contato removendo qualquer sufixo @domínio
    const from = extractPhone(remoteJid);
    console.log("[webhook] from (normalizado):", from);

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

    console.log("[webhook] company lookup por instanceName =", instanceName, "→", company?.id ?? "NÃO ENCONTRADO", "| erro:", companyErr?.message ?? null);

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
      console.error("[webhook] abortado — falha no upsert de conversa:", convErr?.message);
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

    console.log("[webhook] aiResponse:", aiResponse ? `${aiResponse.slice(0, 80)}...` : "null");

    if (!aiResponse) return NextResponse.json({ ok: true });

    const delayMin = training.response_delay_min ?? 3;
    const delayMax = training.response_delay_max ?? 8;
    const delay = (delayMin + Math.random() * (delayMax - delayMin)) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Envia para o remoteJid original (com sufixo @lid/@s.whatsapp.net conforme veio)
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
