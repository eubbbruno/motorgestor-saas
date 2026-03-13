"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  LayoutGridIcon,
  UsersIcon,
  CarIcon,
  BarChart3Icon,
  WalletIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from "@/features/dashboard/hooks";
import { EpicDashboardBackground } from "@/components/dashboard/epic-dashboard-background";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { BigSalesChart } from "@/components/dashboard/big-sales-chart";
import { FipeQuickWidget } from "@/components/dashboard/fipe-quick-widget";
import {
  NextAgendaWidget,
  PendingTasksWidget,
  PipelineSummaryWidget,
  RecentLeadsWidget,
  RecentVehiclesWidget,
  usePendingTasks,
} from "@/components/dashboard/dashboard-widgets";

export default function AppDashboardPage() {
  const metrics = useDashboardMetrics();
  const pendingTasks = usePendingTasks();
  const followupsCount = pendingTasks.data?.total ?? 0;

  const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);

  const pct = (value: number) => `${Math.round(value * 100)}%`;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  } as const;

  const modules = [
    {
      title: "Veículos",
      description: "Estoque, fotos, FIPE e anúncio pronto para publicar.",
      href: "/app/veiculos",
      icon: CarIcon,
    },
    {
      title: "Leads",
      description: "CRM com timeline, tarefas, WhatsApp e histórico.",
      href: "/app/leads",
      icon: UsersIcon,
    },
    {
      title: "Pipeline",
      description: "Kanban do funil com drag and drop por etapas.",
      href: "/app/pipeline",
      icon: LayoutGridIcon,
    },
  ] as const;

  return (
    <div className="dark">
      <div className="relative">
        <EpicDashboardBackground className="rounded-none" />
        <motion.div variants={container} initial="hidden" animate="show" className="relative space-y-10">
          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.10)]" />
                Operação em tempo real
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Dashboard
              </h1>
              <p className="text-sm text-white/60">
                Painel executivo com visão do funil e próximos passos.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/app/leads/novo">Novo lead</Link>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <Link href="/app/veiculos/novo">
                  Novo veículo <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Big chart central</div>
              <p className="text-sm text-white/60">Conversão e evolução do funil com brilho radial.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <BigSalesChart />
              <div className="space-y-6">
                <FipeQuickWidget />
                <PipelineSummaryWidget />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Widgets</div>
              <p className="text-sm text-white/60">Contexto rápido com ações imediatas.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <NextAgendaWidget />
              </div>

              <div className="lg:col-span-4">
                <RecentLeadsWidget />
              </div>
              <div className="lg:col-span-4">
                <RecentVehiclesWidget />
              </div>

              <div className="lg:col-span-4">
                <PendingTasksWidget />
              </div>

              <div className="lg:col-span-4">
                <MiniStatWidget
                  title="Conversões"
                  subtitle="Fechados / total"
                  icon={<BarChart3Icon className="size-4" />}
                  value={metrics.isLoading ? "—" : pct(metrics.data?.taxa_conversao ?? 0)}
                  lines={[
                    `Fechados: ${metrics.isLoading ? "—" : metrics.data?.leads_fechados ?? 0}`,
                    `Total: ${metrics.isLoading ? "—" : metrics.data?.total_leads ?? 0}`,
                  ]}
                />
              </div>
              <div className="lg:col-span-4">
                <MiniStatWidget
                  title="Follow-ups"
                  subtitle="Tarefas pendentes"
                  icon={<LayoutGridIcon className="size-4" />}
                  value={pendingTasks.isLoading ? "—" : followupsCount}
                  lines={[
                    pendingTasks.isError ? "Não foi possível carregar." : "Abra a agenda para executar.",
                    "Padronize: próximo passo por lead.",
                  ]}
                  href="/app/agenda"
                />
              </div>
              <div className="lg:col-span-4">
                <MiniStatWidget
                  title="Métricas"
                  subtitle="Valores (FIPE)"
                  icon={<WalletIcon className="size-4" />}
                  value={metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_fechado ?? 0)}
                  lines={[
                    `Negociação: ${metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_em_negociacao ?? 0)}`,
                    `Ticket: ${metrics.isLoading ? "—" : formatBRL(metrics.data?.ticket_medio ?? 0)}`,
                  ]}
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Hub</div>
              <p className="text-sm text-white/60">Atalhos para navegação rápida.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10 hover:shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white">{m.title}</div>
                        <div className="text-sm text-white/60">{m.description}</div>
                      </div>
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition group-hover:bg-white/10 group-hover:text-white">
                        <Icon className="size-4" />
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80">
                      Abrir <ArrowRightIcon className="size-4 opacity-80" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function MiniStatWidget({
  title,
  subtitle,
  icon,
  value,
  lines,
  href,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  lines: string[];
  href?: string;
}) {
  const reduceMotionLocal = useReducedMotion();
  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotionLocal ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">{title}</div>
            <div className="text-sm text-white/60">{subtitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
              {icon}
            </div>
            {href ? (
              <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href={href}>Abrir</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
        <div className="mt-2 space-y-1 text-xs text-white/55">
          {lines.map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

