import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) {
    return NextResponse.json({ ok: false, error: "Empresa não encontrada." }, { status: 403 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id, export_token")
    .eq("id", profile.company_id)
    .single();

  if (!company) {
    return NextResponse.json({ ok: false, error: "Empresa não encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    token: company.export_token ?? null,
    companyId: company.id,
  });
}
