"use client";

import * as React from "react";
import { BarChart3Icon, UsersIcon, WalletIcon } from "lucide-react";

import { useDashboardMetrics } from "@/features/dashboard/hooks";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardKpiStrip() {
  const metrics = useDashboardMetrics();

  const items = [
    {
      label: "Total Leads",
      value: metrics.isLoading ? "—" : String(metrics.data?.total_leads ?? 0),
      icon: <UsersIcon className="size-4" />,
      accent: "from-cyan-400/25 via-cyan-400/0 to-transparent",
    },
    {
      label: "Conversão",
      value:
        metrics.isLoading ? "—" : `${Math.round((metrics.data?.taxa_conversao ?? 0) * 100)}%`,
      icon: <BarChart3Icon className="size-4" />,
      accent: "from-violet-400/22 via-violet-400/0 to-transparent",
    },
    {
      label: "Valor fechado",
      value: metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_fechado ?? 0),
      icon: <WalletIcon className="size-4" />,
      accent: "from-emerald-300/18 via-emerald-300/0 to-transparent",
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
        >
          <div className={["pointer-events-none absolute inset-0 bg-linear-to-br", it.accent].join(" ")} />
          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                {it.label}
              </div>
              <div className="mt-1 truncate text-base font-semibold tracking-tight text-white">
                {it.value}
              </div>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
              {it.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

