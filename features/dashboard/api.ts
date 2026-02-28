"use client";

export type DashboardMetrics = {
  total_leads: number;
  leads_em_negociacao: number;
  leads_fechados: number;
  valor_em_negociacao: number;
  valor_fechado: number;
  taxa_conversao: number;
  ticket_medio: number;
};

export type DashboardCharts = {
  funnel: Array<{ status: string; label: string; count: number }>;
  leads_monthly: Array<{ month: string; count: number }>;
  closed_value_monthly: Array<{ month: string; value: number }>;
};

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await fetch("/api/metrics/dashboard", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });

  const json = (await res.json().catch(() => null)) as
    | ({ ok: true } & DashboardMetrics)
    | { ok: false; error: string };

  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar métricas.");
  }

  return {
    total_leads: json.total_leads,
    leads_em_negociacao: json.leads_em_negociacao,
    leads_fechados: json.leads_fechados,
    valor_em_negociacao: json.valor_em_negociacao,
    valor_fechado: json.valor_fechado,
    taxa_conversao: json.taxa_conversao,
    ticket_medio: json.ticket_medio,
  };
}

export async function fetchDashboardCharts(): Promise<DashboardCharts> {
  const res = await fetch("/api/metrics/dashboard-charts", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });

  const json = (await res.json().catch(() => null)) as
    | ({ ok: true } & DashboardCharts)
    | { ok: false; error: string };

  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar gráficos.");
  }

  return {
    funnel: json.funnel ?? [],
    leads_monthly: json.leads_monthly ?? [],
    closed_value_monthly: json.closed_value_monthly ?? [],
  };
}

