"use client";

import * as React from "react";
import { BarChart3Icon, TrendingUpIcon, UsersIcon, WalletIcon } from "lucide-react";

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
      icon: UsersIcon,
      sub: `${metrics.data?.leads_em_negociacao ?? 0} em negociação`,
    },
    {
      label: "Conversão",
      value: metrics.isLoading
        ? "—"
        : `${Math.round((metrics.data?.taxa_conversao ?? 0) * 100)}%`,
      icon: TrendingUpIcon,
      sub: `${metrics.data?.leads_fechados ?? 0} fechados`,
    },
    {
      label: "Valor Fechado",
      value: metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_fechado ?? 0),
      icon: WalletIcon,
      sub: `Ticket: ${metrics.isLoading ? "—" : formatBRL(metrics.data?.ticket_medio ?? 0)}`,
    },
    {
      label: "Em Negociação",
      value: metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_em_negociacao ?? 0),
      icon: BarChart3Icon,
      sub: `${metrics.data?.leads_em_negociacao ?? 0} leads`,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className="relative overflow-hidden rounded-xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] px-4 py-3 transition hover:border-[rgba(74,229,74,0.25)] hover:shadow-[0_0_20px_rgba(74,229,74,0.1)]"
          >
            {/* Subtle top glow line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.3)] to-transparent" />
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#6B9E6B]">
                {it.label}
              </div>
              <div className="size-6 rounded-lg bg-[rgba(74,229,74,0.1)] flex items-center justify-center">
                <Icon className="size-3.5 text-[#4AE54A]" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-white truncate">{it.value}</div>
            <div className="mt-0.5 text-[10px] text-[#6B9E6B] truncate">{it.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
