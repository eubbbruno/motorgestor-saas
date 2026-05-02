import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getCompanyId() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  return data?.company_id ?? null;
}

export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Configuração Supabase ausente." }, { status: 500 });

  const companyId = await getCompanyId();
  if (!companyId) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const { data, error } = await supabase
    .from("companies")
    .select("whatsapp_token, whatsapp_phone_number_id")
    .eq("id", companyId)
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    token: data?.whatsapp_token ?? "",
    phone_number_id: data?.whatsapp_phone_number_id ?? "",
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Configuração Supabase ausente." }, { status: 500 });

  const companyId = await getCompanyId();
  if (!companyId) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const token: string = (body.token ?? "").trim();
  const phoneNumberId: string = (body.phone_number_id ?? "").trim();

  const { error } = await supabase
    .from("companies")
    .update({
      whatsapp_token: token || null,
      whatsapp_phone_number_id: phoneNumberId || null,
    })
    .eq("id", companyId);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
