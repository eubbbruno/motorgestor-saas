import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type DashboardMetricsRow = {
  total_leads: number | string | null;
  leads_em_negociacao: number | string | null;
  leads_fechados: number | string | null;
  valor_em_negociacao: number | string | null;
  valor_fechado: number | string | null;
  taxa_conversao: number | string | null;
  ticket_medio: number | string | null;
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
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
      setAll() {
        // métricas não precisam setar cookies
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "Não autenticado." },
      { status: 401 },
    );
  }

  const { data, error } = await supabase.rpc("get_dashboard_metrics");
  const row = (Array.isArray(data) ? data[0] : data) as unknown as
    | DashboardMetricsRow
    | null;

  if (error || !row) {
    console.error("[metrics] get_dashboard_metrics failed", {
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
          "Não foi possível calcular as métricas. Verifique se a migração do dashboard foi aplicada no Supabase.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    total_leads: toNumber(row.total_leads),
    leads_em_negociacao: toNumber(row.leads_em_negociacao),
    leads_fechados: toNumber(row.leads_fechados),
    valor_em_negociacao: toNumber(row.valor_em_negociacao),
    valor_fechado: toNumber(row.valor_fechado),
    taxa_conversao: toNumber(row.taxa_conversao),
    ticket_medio: toNumber(row.ticket_medio),
  });
}

