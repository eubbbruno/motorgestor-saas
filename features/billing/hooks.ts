// Hooks React Query planejados para integração com Mercado Pago:
//
// useSubscription()
//   → Busca a assinatura ativa via GET /api/billing/subscription
//
// useCreateSubscription()
//   → Mutation para POST /api/billing/create-subscription (retorna init_point do MP)
//
// useCancelSubscription()
//   → Mutation para POST /api/billing/cancel

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchBillingSummary } from "@/features/billing/api";

export function useBillingSummary() {
  return useQuery({
    queryKey: ["billing", "summary"],
    queryFn: fetchBillingSummary,
  });
}

