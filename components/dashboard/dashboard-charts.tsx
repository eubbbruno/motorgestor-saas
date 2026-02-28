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

import { Card } from "@/components/ui/card";
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
      <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md lg:col-span-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Funil (por etapa)
            </div>
            <div className="text-sm text-muted-foreground">
              Distribuição atual do pipeline.
            </div>
          </div>
          <BarChart3Icon className="mt-0.5 size-4 text-muted-foreground/80" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-destructive">Não foi possível carregar o funil.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} horizontal={false} />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={90}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md lg:col-span-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Evolução de leads (6 meses)
            </div>
            <div className="text-sm text-muted-foreground">Quantidade de leads criados por mês.</div>
          </div>
          <TrendingUpIcon className="mt-0.5 size-4 text-muted-foreground/80" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-destructive">Não foi possível carregar a evolução.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsMonthly} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#leadsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md lg:col-span-12">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valor fechado por mês (FIPE)
            </div>
            <div className="text-sm text-muted-foreground">
              Soma do valor FIPE dos leads fechados por mês.
            </div>
          </div>
          <WalletIcon className="mt-0.5 size-4 text-muted-foreground/80" />
        </div>

        <div className="mt-5 h-[260px]">
          {charts.isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-destructive">Não foi possível carregar os valores.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={closedValueMonthly} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(v) => formatBRL(Number(v))}
                />
                <Tooltip
                  formatter={(v) => formatBRL(Number(v))}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

