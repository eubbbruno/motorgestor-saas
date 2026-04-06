// Funções server-side planejadas para integração com Mercado Pago:
//
// getSubscription(companyId)
//   → Busca a assinatura ativa da empresa na tabela `subscriptions`
//
// upsertSubscription(companyId, data)
//   → Cria ou atualiza o registro de assinatura (usado pelo webhook e create-subscription)
//
// cancelSubscription(companyId)
//   → Marca a assinatura como cancelled no banco
//
// getActivePlan(companyId)
//   → Retorna o plano atual da empresa (free | starter | pro | enterprise)
//
// Tabela esperada no Supabase: `subscriptions`
//   id, company_id, mp_subscription_id, plan, status, current_period_end, created_at, updated_at

"use client";

export type BillingSummary = {
  plan: {
    name: string;
    price: number;
    max_vehicles: number;
    max_leads: number;
    ai_enabled: boolean;
  };
  usage: {
    vehicles: number;
    leads: number;
  };
};

export async function fetchBillingSummary(): Promise<BillingSummary> {
  const res = await fetch("/api/billing/summary", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });

  const json = (await res.json().catch(() => null)) as
    | ({ ok: true } & BillingSummary)
    | { ok: false; error: string };

  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar billing.");
  }

  return { plan: json.plan, usage: json.usage };
}

