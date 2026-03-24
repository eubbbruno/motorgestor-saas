"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUpIcon } from "lucide-react";

import { useDashboardCharts, useDashboardMetrics } from "@/features/dashboard/hooks";

type Period = "7d" | "30d" | "6m";

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
    <div className="rounded-xl border border-[rgba(74,229,74,0.2)] bg-[#0A1A0C]/95 px-3 py-2.5 text-xs shadow-[0_0_20px_rgba(74,229,74,0.2)] backdrop-blur">
      {label ? <div className="text-[11px] text-[#6B9E6B] mb-1.5">{label}</div> : null}
      <div className="space-y-1">
        {payload
          .filter((p) => p && p.value != null)
          .slice(0, 3)
          .map((p, idx) => {
            const raw = Number(p.value ?? 0);
            const formatted = p.name?.includes("Valor") ? formatBRL(raw) : `${raw}`;
            return (
              <div key={idx} className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-2 text-[#6B9E6B]">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: p.color ?? "#4AE54A" }}
                  />
                  <span className="text-[11px]">{p.name ?? "—"}</span>
                </div>
                <div className="text-sm font-bold text-white">{formatted}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const NEON_GREEN = "#4AE54A";
const NEON_GREEN_GLOW = "rgba(74,229,74,0.35)";
const NEON_GREEN_ALT = "#22C55E";
const NEON_GREEN_ALT_GLOW = "rgba(34,197,94,0.25)";

export function BigSalesChart({
  heightClassName = "h-[280px] sm:h-[320px] lg:h-[340px]",
  showHeader = true,
}: {
  heightClassName?: string;
  showHeader?: boolean;
}) {
  const charts = useDashboardCharts();
  const metrics = useDashboardMetrics();
  const reduceMotion = useReducedMotion();
  const [period, setPeriod] = React.useState<Period>("6m");

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

  const totalClosed = metrics.data?.valor_fechado ?? 0;

  return (
    <div className="relative">
      {showHeader && (
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9E6B]">
              Desempenho de Vendas
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{formatBRL(totalClosed)}</span>
              <span className="text-xs font-semibold text-[#4AE54A] flex items-center gap-0.5">
                <TrendingUpIcon className="size-3" /> total fechado
              </span>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 rounded-lg bg-[rgba(74,229,74,0.06)] border border-[rgba(74,229,74,0.12)] p-1">
            {(["7d", "30d", "6m"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={[
                  "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                  period === p
                    ? "bg-[#4AE54A] text-[#0A1A0C]"
                    : "text-[#6B9E6B] hover:text-white",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={["relative w-full", heightClassName].join(" ")}
      >
        {charts.isLoading ? (
          <div className="text-sm text-[#6B9E6B]">Carregando...</div>
        ) : charts.isError ? (
          <div className="text-sm text-red-400">Não foi possível carregar o gráfico.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                {/* Green neon area fill */}
                <linearGradient id="greenAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NEON_GREEN} stopOpacity={0.28} />
                  <stop offset="60%" stopColor={NEON_GREEN} stopOpacity={0.06} />
                  <stop offset="100%" stopColor={NEON_GREEN} stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="greenAltAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NEON_GREEN_ALT} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={NEON_GREEN_ALT} stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="greenStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={NEON_GREEN} />
                  <stop offset="100%" stopColor={NEON_GREEN_ALT} />
                </linearGradient>
                <linearGradient id="greenCursor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(74,229,74,0.08)" />
                  <stop offset="100%" stopColor="rgba(74,229,74,0.01)" />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(74,229,74,0.08)"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: "#6B9E6B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#6B9E6B", fontSize: 11 }}
                width={36}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#6B9E6B", fontSize: 11 }}
                tickFormatter={(v) => {
                  const n = Number(v ?? 0);
                  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
                  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
                  return `${n}`;
                }}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "url(#greenCursor)" }}
                content={<PremiumTooltip />}
              />

              {/* Glow layer for leads */}
              <Area
                yAxisId="left"
                type="monotone"
                name="Leads"
                dataKey="leads"
                stroke={NEON_GREEN_GLOW}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              {/* Main leads area */}
              <Area
                yAxisId="left"
                type="monotone"
                name="Leads"
                dataKey="leads"
                stroke="url(#greenStroke)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#greenAreaFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: NEON_GREEN,
                  stroke: "rgba(74,229,74,0.3)",
                  strokeWidth: 3,
                }}
                isAnimationActive={!reduceMotion}
                animationDuration={1050}
              />

              {/* Glow layer for value */}
              <Area
                yAxisId="right"
                type="monotone"
                name="Valor fechado"
                dataKey="closedValue"
                stroke={NEON_GREEN_ALT_GLOW}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              {/* Main value area */}
              <Area
                yAxisId="right"
                type="monotone"
                name="Valor fechado"
                dataKey="closedValue"
                stroke={NEON_GREEN_ALT}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 3"
                fill="url(#greenAltAreaFill)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: NEON_GREEN_ALT,
                  stroke: "rgba(34,197,94,0.3)",
                  strokeWidth: 3,
                }}
                isAnimationActive={!reduceMotion}
                animationDuration={1150}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
