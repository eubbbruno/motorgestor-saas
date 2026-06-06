import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendTextMessage } from "@/lib/whatsapp/evolution-go";

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

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
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
    .select("whatsapp_instance_name")
    .eq("id", companyId)
    .single();

  const instanceName = company?.whatsapp_instance_name as string | null;
  if (!instanceName) {
    return NextResponse.json(
      { error: "WhatsApp não conectado. Conecte seu WhatsApp primeiro." },
      { status: 400 },
    );
  }

  const text: string = (body.text ?? body.message ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const result = await sendTextMessage(instanceName, to, text);

  if (result?.error) {
    console.error("[whatsapp/send] Evolution GO error:", result);
    return NextResponse.json(
      { error: result.error ?? "Erro ao enviar mensagem." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: result });
}
