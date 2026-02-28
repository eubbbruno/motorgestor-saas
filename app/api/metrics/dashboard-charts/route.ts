import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const FunnelItemSchema = z.object({
  status: z.string(),
  label: z.string(),
  count: z.union([z.number(), z.string(), z.null()]),
});

const MonthlyCountSchema = z.object({
  month: z.string(),
  count: z.union([z.number(), z.string(), z.null()]),
});

const MonthlyValueSchema = z.object({
  month: z.string(),
  value: z.union([z.number(), z.string(), z.null()]),
});

const ChartsSchema = z.object({
  funnel: z.array(FunnelItemSchema),
  leads_monthly: z.array(MonthlyCountSchema),
  closed_value_monthly: z.array(MonthlyValueSchema),
});

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

type RpcRow = { get_dashboard_charts: unknown } | unknown;

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

  const { data, error } = await supabase.rpc("get_dashboard_charts");
  const row = (Array.isArray(data) ? (data[0] as RpcRow) : (data as RpcRow)) ?? null;

  if (error || !row) {
    console.error("[charts] get_dashboard_charts failed", {
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
          "Não foi possível carregar os gráficos. Verifique se a migração do dashboard charts foi aplicada no Supabase.",
      },
      { status: 500 },
    );
  }

  const payload =
    typeof row === "object" && row !== null && "get_dashboard_charts" in row
      ? (row as { get_dashboard_charts: unknown }).get_dashboard_charts
      : row;

  const parsed = ChartsSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("[charts] invalid payload", {
      userId: user.id,
      issues: parsed.error.issues,
    });
    return NextResponse.json(
      { ok: false, error: "Dados de gráficos inválidos." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    funnel: parsed.data.funnel.map((i) => ({
      status: i.status,
      label: i.label,
      count: toNumber(i.count),
    })),
    leads_monthly: parsed.data.leads_monthly.map((i) => ({
      month: i.month,
      count: toNumber(i.count),
    })),
    closed_value_monthly: parsed.data.closed_value_monthly.map((i) => ({
      month: i.month,
      value: toNumber(i.value),
    })),
  });
}

