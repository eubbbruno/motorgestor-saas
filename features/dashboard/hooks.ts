"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDashboardMetrics } from "@/features/dashboard/api";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["metrics", "dashboard"],
    queryFn: fetchDashboardMetrics,
  });
}

