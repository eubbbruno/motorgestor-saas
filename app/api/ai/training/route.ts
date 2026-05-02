import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function auth() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, companyId: null };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, companyId: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  return { supabase, companyId: profile?.company_id ?? null };
}

export async function GET() {
  const { supabase, companyId } = await auth();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });
  if (!companyId) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const { data, error } = await supabase
    .from("ai_training")
    .select("*")
    .eq("company_id", companyId)
    .single();

  // PGRST116 = no rows returned (first access, no training configured yet)
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: data ?? null });
}

export async function POST(req: NextRequest) {
  const { supabase, companyId } = await auth();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });
  if (!companyId) return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const { error } = await supabase
    .from("ai_training")
    .upsert(
      { ...body, company_id: companyId, updated_at: new Date().toISOString() },
      { onConflict: "company_id" }
    );

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
