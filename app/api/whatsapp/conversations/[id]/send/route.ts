import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendTextMessage } from "@/lib/whatsapp/evolution-go";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  console.log("[conversations/send] conversationId:", id);

  const supabase = await createSupabaseServerClient();
  if (!supabase)
    return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const companyId = profile?.company_id;
  console.log("[conversations/send] userId:", user.id, "| companyId:", companyId ?? "NÃO ENCONTRADO");

  if (!companyId)
    return NextResponse.json({ ok: false, error: "Empresa não encontrada." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const message: string = (body.message ?? "").trim();
  if (!message)
    return NextResponse.json({ ok: false, error: "Mensagem vazia." }, { status: 400 });

  // Busca conversa para obter o número de destino
  const { data: conversation, error: convErr } = await supabase
    .from("whatsapp_conversations")
    .select("contact_phone")
    .eq("id", id)
    .eq("company_id", companyId)
    .single();

  console.log("[conversations/send] conversation lookup:", conversation?.contact_phone ?? "NÃO ENCONTRADA", "| error:", convErr?.message ?? null);

  if (!conversation)
    return NextResponse.json(
      { ok: false, error: "Conversa não encontrada." },
      { status: 404 },
    );

  // Busca instanceName da empresa
  const { data: company, error: companyErr } = await supabase
    .from("companies")
    .select("whatsapp_instance_name")
    .eq("id", companyId)
    .single();

  const instanceName = company?.whatsapp_instance_name as string | null;
  console.log("[conversations/send] instanceName:", instanceName ?? "NÃO CONFIGURADO", "| error:", companyErr?.message ?? null);

  if (!instanceName) {
    return NextResponse.json(
      { ok: false, error: "WhatsApp não conectado." },
      { status: 400 },
    );
  }

  // Monta o número de destino — mantém sufixo @lid se já presente, senão usa @s.whatsapp.net
  const to = conversation.contact_phone.includes("@")
    ? conversation.contact_phone
    : `${conversation.contact_phone}@s.whatsapp.net`;

  console.log("[conversations/send] enviando para:", to, "| mensagem:", message.slice(0, 80));

  const result = await sendTextMessage(instanceName, to, message);
  console.log("[conversations/send] Evolution GO response:", JSON.stringify(result));

  if (result?.error) {
    console.error("[conversations/send] erro no envio:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  await supabase.from("whatsapp_messages").insert({
    conversation_id: id,
    company_id: companyId,
    direction: "outbound",
    message,
    sent_by: "human",
    wa_message_id: result?.key?.id ?? null,
  });

  await supabase
    .from("whatsapp_conversations")
    .update({ last_message: message, last_message_at: new Date().toISOString() })
    .eq("id", id);

  console.log("[conversations/send] concluído com sucesso");
  return NextResponse.json({ ok: true });
}
