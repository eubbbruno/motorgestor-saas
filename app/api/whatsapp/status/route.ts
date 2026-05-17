import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, configured: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, configured: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) return NextResponse.json({ ok: true, configured: false });

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_token, whatsapp_phone_number_id")
    .eq("id", profile.company_id)
    .single();

  const configured = Boolean(company?.whatsapp_token && company?.whatsapp_phone_number_id);
  return NextResponse.json({ ok: true, configured });
}
