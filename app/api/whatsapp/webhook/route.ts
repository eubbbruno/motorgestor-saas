import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { generateWhatsAppResponse } from "@/lib/ai/claude";
import { sendWhatsAppText } from "@/lib/whatsapp/send";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "motorgestor_verify_2026";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verificação falhou." }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  try {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return NextResponse.json({ ok: true });

    const text: string = message.text?.body ?? "";
    const from: string = message.from ?? "";
    const phoneNumberId: string = value?.metadata?.phone_number_id ?? "";

    if (!text || !from || !phoneNumberId) return NextResponse.json({ ok: true });

    const db = createSupabaseServiceClient();
    if (!db) return NextResponse.json({ ok: true });

    // Find company by phone number ID
    const { data: company } = await db
      .from("companies")
      .select("id, whatsapp_token, whatsapp_phone_number_id")
      .eq("whatsapp_phone_number_id", phoneNumberId)
      .single();

    if (!company?.id || !company.whatsapp_token) return NextResponse.json({ ok: true });

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
        { onConflict: "company_id,contact_phone" }
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
      wa_message_id: message.id ?? null,
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
    await new Promise(resolve => setTimeout(resolve, delay));

    // Send via Meta API
    const sendResult = await sendWhatsAppText(
      from,
      aiResponse,
      company.whatsapp_token,
      phoneNumberId,
    );

    // Save outbound message
    await db.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      company_id: companyId,
      direction: "outbound",
      message: aiResponse,
      sent_by: "ai",
      wa_message_id: sendResult.messageId ?? null,
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
    return NextResponse.json({ ok: true }); // sempre 200 para o Meta
  }
}
