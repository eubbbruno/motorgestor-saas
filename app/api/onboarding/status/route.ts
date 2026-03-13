import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSupabase(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase(req);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase não configurado." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ ok: false, error: "Não foi possível carregar perfil." }, { status: 500 });
  }

  const companyId = profile?.company_id ?? null;
  if (!companyId) {
    return NextResponse.json({
      ok: true,
      companyId: null,
      vehicles: 0,
      leads: 0,
      completed: false,
    });
  }

  const [{ count: vehiclesCount, error: vErr }, { count: leadsCount, error: lErr }] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId),
  ]);

  if (vErr || lErr) {
    return NextResponse.json({ ok: false, error: "Não foi possível calcular onboarding." }, { status: 500 });
  }

  const vehicles = Number(vehiclesCount ?? 0);
  const leads = Number(leadsCount ?? 0);
  const completed = vehicles > 0 && leads > 0;

  return NextResponse.json({ ok: true, companyId, vehicles, leads, completed });
}

