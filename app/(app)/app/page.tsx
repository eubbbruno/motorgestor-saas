"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  LayoutGridIcon,
  MapPinIcon,
  PlusIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from "@/features/dashboard/hooks";
import { BigSalesChart } from "@/components/dashboard/big-sales-chart";
import { FipeQuickWidget } from "@/components/dashboard/fipe-quick-widget";
import {
  NextAgendaWidget,
  RecentLeadsWidget,
  PipelineSummaryWidget,
} from "@/components/dashboard/dashboard-widgets";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";

// ─── Animation variants ────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
} as const;

const card = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

// ─── Card shell ────────────────────────────────────────────────────────────

function DashCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl bg-[#0F2014]",
        "border border-[rgba(74,229,74,0.12)]",
        "shadow-[0_0_20px_rgba(74,229,74,0.06)]",
        className,
      ].join(" ")}
    >
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.25)] to-transparent" />
      {children}
    </div>
  );
}

// ─── Card header ───────────────────────────────────────────────────────────

function CardHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(74,229,74,0.08)]">
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded-lg bg-[rgba(74,229,74,0.1)] flex items-center justify-center">
          <Icon className="size-4 text-[#4AE54A]" />
        </div>
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Regions / Performance Widget ─────────────────────────────────────────

function PerformanceCard() {
  const metrics = useDashboardMetrics();

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v);

  const regions = [
    {
      name: "Em Negociação",
      value: metrics.isLoading
        ? "—"
        : formatBRL(metrics.data?.valor_em_negociacao ?? 0),
      count: metrics.data?.leads_em_negociacao ?? 0,
      active: true,
    },
    {
      name: "Ticket Médio",
      value: metrics.isLoading ? "—" : formatBRL(metrics.data?.ticket_medio ?? 0),
      count: null,
      active: false,
    },
    {
      name: "Leads Fechados",
      value: metrics.isLoading ? "—" : String(metrics.data?.leads_fechados ?? 0),
      count: null,
      active: false,
    },
    {
      name: "Total de Leads",
      value: metrics.isLoading ? "—" : String(metrics.data?.total_leads ?? 0),
      count: null,
      active: false,
    },
  ];

  return (
    <DashCard className="h-full">
      <CardHeader
        icon={MapPinIcon}
        title="Performance Geral"
        action={
          <Link
            href="/app/relatorios"
            className="text-xs text-[#6B9E6B] hover:text-[#4AE54A] flex items-center gap-1 transition-colors"
          >
            Ver mais <ArrowRightIcon className="size-3" />
          </Link>
        }
      />
      <div className="p-5 space-y-3">
        {regions.map((r) => (
          <div
            key={r.name}
            className={[
              "flex items-center justify-between rounded-xl px-4 py-3 transition-colors",
              r.active
                ? "bg-[rgba(74,229,74,0.1)] border border-[rgba(74,229,74,0.2)]"
                : "bg-[rgba(74,229,74,0.04)] border border-[rgba(74,229,74,0.07)]",
            ].join(" ")}
          >
            <div>
              <div className="text-xs text-[#6B9E6B] mb-0.5">{r.name}</div>
              <div className="text-base font-bold text-white">{r.value}</div>
            </div>
            {r.active && (
              <div className="rounded-full bg-[#4AE54A] px-2.5 py-0.5 text-[10px] font-bold text-[#0A1A0C]">
                {r.count} leads
              </div>
            )}
          </div>
        ))}

        {/* Pipeline mini */}
        <div className="pt-2">
          <PipelineSummaryWidget compact />
        </div>
      </div>
    </DashCard>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AppDashboardPage() {
  const metrics = useDashboardMetrics();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* ── Page header ── */}
      <motion.div
        variants={card}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-1.5 rounded-full bg-[#4AE54A] animate-pulse" />
            <span className="text-xs text-[#6B9E6B] font-medium">Operação em tempo real</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#6B9E6B] mt-0.5">
            Painel executivo com visão do funil e próximos passos.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.06)] text-white hover:bg-[rgba(74,229,74,0.12)]"
          >
            <Link href="/app/leads/novo">
              <PlusIcon className="size-3.5 mr-1.5" /> Novo lead
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd13d] font-bold shadow-[0_0_14px_rgba(74,229,74,0.35)]"
          >
            <Link href="/app/veiculos/novo">
              <CarIcon className="size-3.5 mr-1.5" /> Novo veículo
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* ── KPI Strip ── */}
      <motion.div variants={card}>
        <DashboardKpiStrip />
      </motion.div>

      {/* ── Row 1: Chart (2/3) + FIPE Widget (1/3) ── */}
      <motion.div variants={card} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 — Sales Chart */}
        <DashCard className="md:col-span-2 lg:col-span-2">
          <CardHeader
            icon={BarChart3Icon}
            title="Desempenho de Vendas"
            action={
              <Link
                href="/app/relatorios"
                className="text-xs text-[#6B9E6B] hover:text-[#4AE54A] flex items-center gap-1 transition-colors"
              >
                Relatórios <ArrowRightIcon className="size-3" />
              </Link>
            }
          />
          <div className="p-5">
            <BigSalesChart showHeader={true} heightClassName="h-[240px] sm:h-[280px]" />
          </div>
        </DashCard>

        {/* Card 2 — FIPE Quick Widget */}
        <DashCard className="lg:col-span-1">
          <CardHeader icon={WalletIcon} title="Consulta FIPE" />
          <div className="p-5">
            <FipeQuickWidget compact />
          </div>
        </DashCard>
      </motion.div>

      {/* ── Row 2: Events (1/3) + Leads (1/3) + Performance (1/3) ── */}
      <motion.div variants={card} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 3 — Próximos Eventos */}
        <DashCard className="h-full">
          <CardHeader
            icon={CalendarIcon}
            title="Próximos Eventos"
            action={
              <Link
                href="/app/agenda"
                className="text-xs text-[#6B9E6B] hover:text-[#4AE54A] flex items-center gap-1 transition-colors"
              >
                Ver agenda <ArrowRightIcon className="size-3" />
              </Link>
            }
          />
          <div className="p-5">
            <NextAgendaWidget compact />
          </div>
        </DashCard>

        {/* Card 4 — Leads Recentes */}
        <DashCard className="h-full">
          <CardHeader
            icon={UsersIcon}
            title="Leads Recentes"
            action={
              <Link
                href="/app/leads"
                className="text-xs text-[#6B9E6B] hover:text-[#4AE54A] flex items-center gap-1 transition-colors"
              >
                Ver todos <ArrowRightIcon className="size-3" />
              </Link>
            }
          />
          <div className="p-5">
            <RecentLeadsWidget />
          </div>
        </DashCard>

        {/* Card 5 — Performance Geral */}
        <div className="md:col-span-2 lg:col-span-1">
          <PerformanceCard />
        </div>
      </motion.div>

      {/* ── Quick action modules ── */}
      <motion.div variants={card} className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/app/veiculos",
            icon: CarIcon,
            title: "Veículos",
            desc: "Estoque, fotos, FIPE e anúncio.",
          },
          {
            href: "/app/leads",
            icon: UsersIcon,
            title: "Leads",
            desc: "CRM, timeline e WhatsApp.",
          },
          {
            href: "/app/pipeline",
            icon: LayoutGridIcon,
            title: "Pipeline",
            desc: "Kanban com drag and drop.",
          },
        ].map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex items-center gap-4 rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0F2014] px-5 py-4 transition hover:border-[rgba(74,229,74,0.25)] hover:shadow-[0_0_20px_rgba(74,229,74,0.1)]"
          >
            <div className="size-10 rounded-xl bg-[rgba(74,229,74,0.1)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(74,229,74,0.18)] transition-colors">
              <m.icon className="size-5 text-[#4AE54A]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{m.title}</div>
              <div className="text-xs text-[#6B9E6B] truncate">{m.desc}</div>
            </div>
            <ArrowRightIcon className="size-4 text-[#6B9E6B] group-hover:text-[#4AE54A] transition-colors shrink-0" />
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
