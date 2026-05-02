import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendWhatsAppText } from "@/lib/whatsapp/send";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const companyId = profile?.company_id;
  if (!companyId) return NextResponse.json({ ok: false, error: "Empresa não encontrada." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const message: string = (body.message ?? "").trim();
  if (!message) return NextResponse.json({ ok: false, error: "Mensagem vazia." }, { status: 400 });

  const { data: conversation } = await supabase
    .from("whatsapp_conversations")
    .select("contact_phone")
    .eq("id", id)
    .eq("company_id", companyId)
    .single();

  if (!conversation) return NextResponse.json({ ok: false, error: "Conversa não encontrada." }, { status: 404 });

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_token, whatsapp_phone_number_id")
    .eq("id", companyId)
    .single();

  if (!company?.whatsapp_token || !company.whatsapp_phone_number_id) {
    return NextResponse.json({ ok: false, error: "Credenciais WhatsApp não configuradas." }, { status: 400 });
  }

  const result = await sendWhatsAppText(
    conversation.contact_phone,
    message,
    company.whatsapp_token,
    company.whatsapp_phone_number_id,
  );

  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 500 });

  await supabase.from("whatsapp_messages").insert({
    conversation_id: id,
    company_id: companyId,
    direction: "outbound",
    message,
    sent_by: "human",
    wa_message_id: result.messageId ?? null,
  });

  await supabase
    .from("whatsapp_conversations")
    .update({ last_message: message, last_message_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
