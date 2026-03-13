"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3Icon, TrendingUpIcon, WalletIcon } from "lucide-react";

import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { useDashboardCharts } from "@/features/dashboard/hooks";

function formatMonth(value: string) {
  // "YYYY-MM" -> "MMM/YY"
  const [y, m] = value.split("-").map(Number);
  if (!y || !m) return value;
  const d = new Date(y, m - 1, 1);
  const label = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d);
  return `${label}/${String(y).slice(2)}`.replace(".", "");
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function PremiumTooltip({
  active,
  label,
  payload,
  valueFormatter,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ name?: string; value?: unknown }>;
  valueFormatter?: (v: unknown) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const raw = item?.value;
  const value = valueFormatter ? valueFormatter(raw) : String(raw ?? "");

  return (
    <div className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur">
      {label ? <div className="text-[11px] text-white/70">{label}</div> : null}
      <div className="mt-0.5 text-sm font-semibold tracking-tight text-white">
        {value}
      </div>
      {item?.name ? <div className="mt-0.5 text-[11px] text-white/60">{item.name}</div> : null}
    </div>
  );
}

export function DashboardCharts() {
  const charts = useDashboardCharts();

  const funnel = charts.data?.funnel ?? [];
  const leadsMonthly = (charts.data?.leads_monthly ?? []).map((i) => ({
    ...i,
    monthLabel: formatMonth(i.month),
  }));
  const closedValueMonthly = (charts.data?.closed_value_monthly ?? []).map((i) => ({
    ...i,
    monthLabel: formatMonth(i.month),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <PremiumSurface className="lg:col-span-4">
        <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-white/60">
              Funil (por etapa)
            </div>
            <div className="text-sm text-white/55">
              Distribuição atual do pipeline.
            </div>
          </div>
          <BarChart3Icon className="mt-0.5 size-4 text-white/55" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar o funil.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={90}
                  tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  content={<PremiumTooltip valueFormatter={(v) => `${Number(v ?? 0)}`} />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-2)"
                  radius={[10, 10, 10, 10]}
                  isAnimationActive
                  animationDuration={850}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        </div>
      </PremiumSurface>

      <PremiumSurface className="lg:col-span-8">
        <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-white/60">
              Evolução de leads (6 meses)
            </div>
            <div className="text-sm text-white/55">Quantidade de leads criados por mês.</div>
          </div>
          <TrendingUpIcon className="mt-0.5 size-4 text-white/55" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar a evolução.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsMonthly} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }} />
                <Tooltip
                  content={<PremiumTooltip valueFormatter={(v) => `${Number(v ?? 0)}`} />}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#leadsFill)"
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        </div>
      </PremiumSurface>

      <PremiumSurface className="lg:col-span-12">
        <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-white/60">
              Valor fechado por mês (FIPE)
            </div>
            <div className="text-sm text-white/55">
              Soma do valor FIPE dos leads fechados por mês.
            </div>
          </div>
          <WalletIcon className="mt-0.5 size-4 text-white/55" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar os valores.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={closedValueMonthly} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                  tickFormatter={(v) => formatBRL(Number(v))}
                />
                <Tooltip
                  content={<PremiumTooltip valueFormatter={(v) => formatBRL(Number(v ?? 0))} />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--chart-4)"
                  radius={[10, 10, 10, 10]}
                  isAnimationActive
                  animationDuration={850}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        </div>
      </PremiumSurface>
    </div>
  );
}

