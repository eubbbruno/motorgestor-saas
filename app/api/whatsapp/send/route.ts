import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const META_API = "https://graph.facebook.com/v25.0";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const to: string = (body.to ?? "").replace(/\D/g, "");

  if (!to) {
    return NextResponse.json({ error: "Campo 'to' é obrigatório." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Configuração Supabase ausente." }, { status: 500 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const companyId = profile?.company_id;
  if (!companyId) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 400 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_token, whatsapp_phone_number_id")
    .eq("id", companyId)
    .single();

  const token = company?.whatsapp_token;
  const phoneNumberId = company?.whatsapp_phone_number_id;

  if (!token || !phoneNumberId) {
    return NextResponse.json(
      { error: "Credenciais WhatsApp não configuradas. Salve o Token e o Phone Number ID primeiro." },
      { status: 400 },
    );
  }

  const metaRes = await fetch(`${META_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: { name: "hello_world", language: { code: "en_US" } },
    }),
  });

  const metaData = await metaRes.json();

  if (!metaRes.ok) {
    console.error("[whatsapp/send] Meta error:", metaData);
    return NextResponse.json({ error: metaData?.error?.message ?? "Erro na API do Meta." }, { status: metaRes.status });
  }

  return NextResponse.json({ ok: true, data: metaData });
}
