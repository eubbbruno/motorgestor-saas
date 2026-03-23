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
import { BigSalesChart } from "@/components/dashboard/big-sales-chart";
import { FipeQuickWidget } from "@/components/dashboard/fipe-quick-widget";
import {
  NextAgendaWidget,
  PendingTasksWidget,
  PipelineSummaryWidget,
  RecentActivityWidget,
  LeadsTodayWidget,
  PerformanceWidget,
  TasksTodayWidget,
  HotOpportunitiesWidget,
  DoNowWidget,
  RecentLeadsWidget,
  RecentVehiclesWidget,
  usePendingTasks,
} from "@/components/dashboard/dashboard-widgets";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

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
        <motion.div variants={container} initial="hidden" animate="show" className="relative space-y-8 sm:space-y-10">
          <motion.div variants={item} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.10)]" />
                Operação em tempo real
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                Dashboard
              </h1>
              <p className="text-sm text-white/60">
                Painel executivo com visão do funil e próximos passos.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
              >
                <Link href="/app/leads/novo">Novo lead</Link>
              </Button>
              <Button asChild className="w-full bg-white text-black hover:bg-white/90 sm:w-auto">
                <Link href="/app/veiculos/novo">
                  Novo veículo <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                        Performance do funil
                      </div>
                      <div className="text-sm text-white/60">
                        Leads/mês e valor fechado (FIPE) — últimos 6 meses.
                      </div>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
                      <BarChart3Icon className="size-4" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <DashboardKpiStrip />
                    <BigSalesChart
                      showHeader={false}
                      heightClassName="h-[220px] sm:h-[300px] lg:h-[340px]"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                {/* Mobile: carrossel horizontal / Desktop: stack */}
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-fr">
                  <div className="min-w-[292px] sm:min-w-0">
                    <FipeQuickWidget compact />
                  </div>
                  <div className="min-w-[292px] sm:min-w-0">
                    <PipelineSummaryWidget compact />
                  </div>
                  <div className="min-w-[292px] sm:min-w-0">
                    <NextAgendaWidget compact />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Hoje</div>
              <p className="text-sm text-white/60">
                O que você precisa ver para vender mais rápido.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <RecentActivityWidget />
              </div>
              <div className="lg:col-span-4">
                {/* Mobile: carrossel horizontal para reduzir altura */}
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
                  <div className="min-w-[292px] sm:min-w-0">
                    <TasksTodayWidget />
                  </div>
                  <div className="min-w-[292px] sm:min-w-0">
                    <LeadsTodayWidget />
                  </div>
                  <div className="min-w-[292px] sm:min-w-0">
                    <HotOpportunitiesWidget />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">A fazer agora</div>
              <p className="text-sm text-white/60">
                3 ações objetivas para mover o funil hoje.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <DoNowWidget />
              </div>
              <div className="lg:col-span-4">
                <div className="grid gap-6">
                  <PerformanceWidget />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Widgets</div>
              <p className="text-sm text-white/60">
                Blocos organizados em linhas, com largura e hierarquia consistentes.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <RecentLeadsWidget />
              <RecentVehiclesWidget />
              <PendingTasksWidget />
            </div>

            <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 lg:grid-cols-3">
              <MiniStatWidget
                title="Pipeline"
                subtitle="Em negociação / fechados"
                icon={<BarChart3Icon className="size-4" />}
                value={metrics.isLoading ? "—" : metrics.data?.leads_em_negociacao ?? 0}
                lines={[
                  `Fechados: ${metrics.isLoading ? "—" : metrics.data?.leads_fechados ?? 0}`,
                  `Total: ${metrics.isLoading ? "—" : metrics.data?.total_leads ?? 0}`,
                ]}
                href="/app/pipeline"
              />
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
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Hub</div>
              <p className="text-sm text-white/60">Ações e atalhos principais (sem cara de cards repetidos).</p>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
              <div className="lg:col-span-4">
                <PremiumSurface>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Ações rápidas
                        </div>
                        <div className="text-sm text-white/60">
                          Crie, registre e avance o pipeline.
                        </div>
                      </div>
                      <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
                        <LayoutGridIcon className="size-4" />
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                        <Link href="/app/leads/novo">Novo lead</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        <Link href="/app/veiculos/novo">Novo veículo</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        <Link href="/app/pipeline">Ver pipeline</Link>
                      </Button>
                    </div>
                  </div>
                </PremiumSurface>
              </div>
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
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              {title}
            </div>
            <div className="text-sm text-white/60">{subtitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
              {icon}
            </div>
            {href ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href={href}>Abrir</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
        <div className="mt-3 space-y-1 text-xs text-white/55">
          {lines.map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

