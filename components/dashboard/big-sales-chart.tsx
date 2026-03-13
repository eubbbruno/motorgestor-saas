"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  ComposedChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUpIcon } from "lucide-react";

import { useDashboardCharts } from "@/features/dashboard/hooks";

function formatMonth(value: string) {
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
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ name?: string; value?: unknown; color?: string }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/70 px-3 py-2 text-xs shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur">
      {label ? <div className="text-[11px] text-white/70">{label}</div> : null}
      <div className="mt-1 space-y-1">
        {payload
          .filter((p) => p && p.value != null)
          .slice(0, 3)
          .map((p, idx) => {
            const raw = Number(p.value ?? 0);
            const formatted = p.name?.includes("Valor") ? formatBRL(raw) : `${raw}`;
            return (
              <div key={idx} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-white/70">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: p.color ?? "rgba(255,255,255,0.6)" }}
                  />
                  <span className="text-[11px]">{p.name ?? "—"}</span>
                </div>
                <div className="text-sm font-semibold tracking-tight text-white">{formatted}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const NEON_LEADS = "rgba(34,211,238,0.95)"; // cyan
const NEON_LEADS_GLOW = "rgba(34,211,238,0.35)";
const NEON_VALUE = "rgba(168,85,247,0.95)"; // violet
const NEON_VALUE_GLOW = "rgba(168,85,247,0.30)";

export function BigSalesChart({
  heightClassName = "h-[320px] sm:h-[340px]",
  showHeader = true,
}: {
  heightClassName?: string;
  showHeader?: boolean;
}) {
  const charts = useDashboardCharts();
  const reduceMotion = useReducedMotion();

  const data = React.useMemo(() => {
    const leadsMonthly = charts.data?.leads_monthly ?? [];
    const closedValueMonthly = charts.data?.closed_value_monthly ?? [];
    const map = new Map<string, { month: string; leads: number; closedValue: number }>();
    for (const i of leadsMonthly) {
      map.set(i.month, { month: i.month, leads: Number(i.count ?? 0), closedValue: 0 });
    }
    for (const i of closedValueMonthly) {
      const prev = map.get(i.month) ?? { month: i.month, leads: 0, closedValue: 0 };
      prev.closedValue = Number(i.value ?? 0);
      map.set(i.month, prev);
    }
    const rows = Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
    return rows.map((r) => ({ ...r, monthLabel: formatMonth(r.month) }));
  }, [charts.data?.closed_value_monthly, charts.data?.leads_monthly]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.12),transparent_64%)] blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.10),transparent_64%)] blur-3xl" />
      </div>

      {showHeader ? (
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Big Sales Chart
            </div>
            <div className="text-sm text-white/60">
              Leads por mês + valor fechado (FIPE) nos últimos 6 meses.
            </div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
            <TrendingUpIcon className="size-4" />
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={[showHeader ? "relative mt-5 w-full" : "relative w-full", heightClassName].join(" ")}
      >
        {charts.isLoading ? (
          <div className="text-sm text-white/55">Carregando...</div>
        ) : charts.isError ? (
          <div className="text-sm text-red-300">Não foi possível carregar o gráfico.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 8, right: 12, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="bigLeadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NEON_LEADS} stopOpacity={0.26} />
                  <stop offset="100%" stopColor={NEON_LEADS} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="bigCursor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="monthLabel" tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="left"
                tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
                tickFormatter={(v) => {
                  const n = Number(v ?? 0);
                  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
                  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
                  return `${n}`;
                }}
                width={48}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "url(#bigCursor)" }} content={<PremiumTooltip />} />
              {/* Glow strokes (behind) */}
              <Area
                yAxisId="left"
                type="monotone"
                name="Leads"
                dataKey="leads"
                stroke={NEON_LEADS_GLOW}
                strokeWidth={6}
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              <Area
                yAxisId="left"
                type="monotone"
                name="Leads"
                dataKey="leads"
                stroke={NEON_LEADS}
                strokeWidth={2.5}
                fill="url(#bigLeadsFill)"
                dot={false}
                activeDot={{ r: 5, fill: NEON_LEADS, stroke: "rgba(255,255,255,0.35)", strokeWidth: 2 }}
                isAnimationActive={!reduceMotion}
                animationDuration={950}
              />
              {/* Glow strokes (behind) */}
              <Line
                yAxisId="right"
                type="monotone"
                name="Valor fechado"
                dataKey="closedValue"
                stroke={NEON_VALUE_GLOW}
                strokeWidth={6}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                name="Valor fechado"
                dataKey="closedValue"
                stroke={NEON_VALUE}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: NEON_VALUE, stroke: "rgba(255,255,255,0.35)", strokeWidth: 2 }}
                isAnimationActive={!reduceMotion}
                animationDuration={1050}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}

