import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type UsageRow = {
  plan_name: string;
  plan_price: string | number;
  max_vehicles: number;
  max_leads: number;
  ai_enabled: boolean;
  used_vehicles: string | number;
  used_leads: string | number;
};

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase não configurado." },
      { status: 500 },
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_company_usage");
  const row = (Array.isArray(data) ? (data[0] as UsageRow | undefined) : (data as UsageRow)) ?? null;

  if (error || !row) {
    console.error("[billing] get_company_usage failed", {
      userId: user.id,
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível carregar o billing. Verifique se a migração de planos foi aplicada no Supabase.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    plan: {
      name: row.plan_name,
      price: toNumber(row.plan_price),
      max_vehicles: row.max_vehicles,
      max_leads: row.max_leads,
      ai_enabled: row.ai_enabled,
    },
    usage: {
      vehicles: toNumber(row.used_vehicles),
      leads: toNumber(row.used_leads),
    },
  });
}

