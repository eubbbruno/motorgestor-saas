import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getCompanyId() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();
  return data?.company_id ?? null;
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });

  const companyId = await getCompanyId();
  if (!companyId) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code: string = body.code ?? "";
  if (!code) return NextResponse.json({ ok: false, error: "code ausente." }, { status: 400 });

  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

  if (!appId || !appSecret) {
    return NextResponse.json({ ok: false, error: "FACEBOOK_APP_ID ou FACEBOOK_APP_SECRET não configurados." }, { status: 500 });
  }

  // 1. Troca code → access token
  const tokenParams = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    code,
    redirect_uri: `${siteUrl}/app/whatsapp`,
  });

  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams}`,
    { method: "GET" },
  );
  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    console.error("[embedded-signup] token exchange error:", tokenData);
    return NextResponse.json({
      ok: false,
      error: tokenData.error?.message ?? "Falha ao trocar code pelo token.",
    }, { status: 400 });
  }

  const accessToken: string = tokenData.access_token;

  // 2. Busca phone numbers associados ao token
  const phoneRes = await fetch(
    `https://graph.facebook.com/v19.0/me/phone_numbers?access_token=${accessToken}&fields=display_phone_number,verified_name`,
  );
  const phoneData = await phoneRes.json();

  const firstPhone = phoneData.data?.[0];
  const phoneNumberId: string = firstPhone?.id ?? "";
  const phoneNumber: string = firstPhone?.display_phone_number ?? "";

  // 3. Persiste no Supabase
  const { error: updateError } = await supabase
    .from("companies")
    .update({
      whatsapp_token: accessToken,
      whatsapp_phone_number_id: phoneNumberId || null,
    })
    .eq("id", companyId);

  if (updateError) {
    console.error("[embedded-signup] Supabase update error:", updateError);
    return NextResponse.json({
      ok: false,
      error: updateError.message,
      hint: "Execute db/migrations/2026_whatsapp_full.sql no Supabase.",
    }, { status: 500 });
  }

  return NextResponse.json({ ok: true, phone_number: phoneNumber, phone_number_id: phoneNumberId });
}
