"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchBillingSummary } from "@/features/billing/api";

export function useBillingSummary() {
  return useQuery({
    queryKey: ["billing", "summary"],
    queryFn: fetchBillingSummary,
  });
}

