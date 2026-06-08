import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { generateWhatsAppResponse } from "@/lib/ai/claude";
import { sendTextMessage } from "@/lib/whatsapp/evolution-go";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  console.log("[webhook] recebido:", JSON.stringify(body).slice(0, 200));

  try {
    // Only handle incoming messages
    if (body?.event !== "messages.upsert") return NextResponse.json({ ok: true });

    const instanceName: string = body?.instance ?? "";
    const remoteJid: string = body?.data?.key?.remoteJid ?? "";
    const text: string =
      body?.data?.message?.conversation ??
      body?.data?.message?.extendedTextMessage?.text ??
      "";

    // Ignore group messages and status broadcasts
    if (!instanceName || !remoteJid || !text) return NextResponse.json({ ok: true });
    if (remoteJid.endsWith("@g.us") || remoteJid === "status@broadcast") {
      return NextResponse.json({ ok: true });
    }

    // Store only the phone number part, stripping the @s.whatsapp.net suffix
    const from = remoteJid.replace("@s.whatsapp.net", "");

    const db = createSupabaseServiceClient();
    if (!db) return NextResponse.json({ ok: true });

    const { data: company } = await db
      .from("companies")
      .select("id")
      .eq("whatsapp_instance_name", instanceName)
      .single();

    if (!company?.id) return NextResponse.json({ ok: true });

    const companyId = company.id;

    // Upsert conversation (unique on company_id + contact_phone)
    const { data: conversation } = await db
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

    if (!conversation) return NextResponse.json({ ok: true });

    // Save inbound message
    await db.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      company_id: companyId,
      direction: "inbound",
      message: text,
      sent_by: "human",
      wa_message_id: body?.data?.key?.id ?? null,
    });

    // Update unread count
    await db
      .from("whatsapp_conversations")
      .update({ unread_count: (conversation.unread_count ?? 0) + 1 })
      .eq("id", conversation.id);

    // Fetch AI training config
    const { data: training } = await db
      .from("ai_training")
      .select("*")
      .eq("company_id", companyId)
      .single();

    if (!training?.ai_enabled) return NextResponse.json({ ok: true });

    // Recent conversation history for context
    const { data: history } = await db
      .from("whatsapp_messages")
      .select("direction, message")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Available vehicles for context
    const { data: vehicles } = await db
      .from("vehicles")
      .select("title, make, model, year, price, color, mileage, status")
      .eq("company_id", companyId)
      .eq("status", "disponivel")
      .limit(20);

    // Generate AI response
    const aiResponse = await generateWhatsAppResponse(
      text,
      (history ?? []).reverse(),
      training,
      vehicles ?? [],
    );

    if (!aiResponse) return NextResponse.json({ ok: true });

    // Human-like typing delay
    const delayMin = training.response_delay_min ?? 3;
    const delayMax = training.response_delay_max ?? 8;
    const delay = (delayMin + Math.random() * (delayMax - delayMin)) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Send via Evolution GO (use remoteJid with @s.whatsapp.net for the API)
    const sendResult = await sendTextMessage(instanceName, remoteJid, aiResponse);

    // Save outbound message
    await db.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      company_id: companyId,
      direction: "outbound",
      message: aiResponse,
      sent_by: "ai",
      wa_message_id: sendResult?.key?.id ?? null,
    });

    // Update conversation with last outbound message
    await db
      .from("whatsapp_conversations")
      .update({
        last_message: aiResponse,
        last_message_at: new Date().toISOString(),
        unread_count: 0,
      })
      .eq("id", conversation.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[WhatsApp webhook]", err);
    return NextResponse.json({ ok: true }); // sempre 200 para o Evolution GO
  }
}
