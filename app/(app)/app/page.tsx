"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  HandshakeIcon,
  LayoutGridIcon,
  MessageSquareTextIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/features/events/hooks";
import { useDashboardMetrics } from "@/features/dashboard/hooks";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { EpicDashboardBackground } from "@/components/dashboard/epic-dashboard-background";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

export default function AppDashboardPage() {
  const metrics = useDashboardMetrics();
  const events = useEvents();

  const upcoming = useMemo(() => {
    const now = Date.now();
    const list = events.data ?? [];
    return list.filter((e) => new Date(e.start_at).getTime() >= now).length;
  }, [events.data]);

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
    {
      title: "Agenda",
      description: "Calendário e próximos follow-ups do time.",
      href: "/app/agenda",
      icon: CalendarIcon,
    },
    {
      title: "Relatórios",
      description: "Visão executiva e números para decisão.",
      href: "/app/relatorios",
      icon: BarChart3Icon,
    },
    {
      title: "Billing",
      description: "Plano, limites e consumo atual da empresa.",
      href: "/app/billing",
      icon: WalletIcon,
    },
  ] as const;

  return (
    <div className="dark">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07080b] p-5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_50px_120px_rgba(0,0,0,0.75)] sm:p-8">
        <EpicDashboardBackground />
        <motion.div variants={container} initial="hidden" animate="show" className="relative space-y-8">
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
                Visão executiva do dia: estoque, leads, funil e agenda.
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
              <div className="text-base font-semibold tracking-tight text-white">Home do sistema</div>
              <p className="text-sm text-white/60">
                Acesso rápido aos módulos principais do MotorGestor.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <PremiumSurface key={m.href} className="group">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-white">{m.title}</div>
                          <div className="text-sm text-white/60">{m.description}</div>
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition group-hover:bg-white/10 group-hover:text-white">
                          <Icon className="size-4" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-between border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                          <Link href={m.href}>
                            Abrir <ArrowRightIcon className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </PremiumSurface>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <PremiumSurface>
              <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-base font-semibold tracking-tight text-white">Ações rápidas</div>
                    <p className="text-sm text-white/60">
                      Atalhos para executar as rotinas mais comuns.
                    </p>
                  </div>
                  <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
                    <Button
                      asChild
                      variant="outline"
                      className="justify-start border-white/10 bg-white/5 text-white hover:bg-white/10 sm:justify-center"
                    >
                      <Link href="/app/veiculos/novo">
                        <CarIcon className="mr-2 size-4" />
                        Novo veículo
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="justify-start border-white/10 bg-white/5 text-white hover:bg-white/10 sm:justify-center"
                    >
                      <Link href="/app/leads/novo">
                        <UsersIcon className="mr-2 size-4" />
                        Novo lead
                      </Link>
                    </Button>
                    <Button asChild className="justify-start bg-white text-black hover:bg-white/90 sm:justify-center">
                      <Link href="/app/pipeline">
                        <LayoutGridIcon className="mr-2 size-4" />
                        Ver Pipeline
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </PremiumSurface>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Métricas</div>
              <p className="text-sm text-white/60">
                Pipeline, conversão e valores estimados a partir do seu funil.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Total Leads"
                value={metrics.isLoading ? "—" : metrics.data?.total_leads ?? 0}
                hint="Leads registrados na sua empresa."
                icon={<UsersIcon className="size-4" />}
                accent="from-emerald-400/35 via-emerald-400/0 to-transparent"
              />
              <MetricCard
                label="Em Negociação"
                value={metrics.isLoading ? "—" : metrics.data?.leads_em_negociacao ?? 0}
                hint="Leads na etapa de negociação."
                icon={<HandshakeIcon className="size-4" />}
                accent="from-blue-400/35 via-blue-400/0 to-transparent"
              />
              <MetricCard
                label="Fechados"
                value={metrics.isLoading ? "—" : metrics.data?.leads_fechados ?? 0}
                hint="Leads marcados como fechados."
                icon={<TrendingUpIcon className="size-4" />}
                accent="from-violet-400/30 via-violet-400/0 to-transparent"
              />
              <MetricCard
                label="Conversão"
                value={metrics.isLoading ? "—" : pct(metrics.data?.taxa_conversao ?? 0)}
                hint="Fechados / total de leads."
                icon={<BarChart3Icon className="size-4" />}
                accent="from-white/18 via-white/0 to-transparent"
              />

              <MetricCard
                className="lg:col-span-2"
                label="Valor em Negociação"
                value={
                  metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_em_negociacao ?? 0)
                }
                hint="Soma de FIPE dos leads ainda não fechados (quando disponível)."
                icon={<WalletIcon className="size-4" />}
                accent="from-amber-300/24 via-amber-300/0 to-transparent"
              />
              <MetricCard
                label="Valor Fechado"
                value={metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_fechado ?? 0)}
                hint="Soma de FIPE dos fechados."
                icon={<WalletIcon className="size-4" />}
                accent="from-emerald-300/22 via-emerald-300/0 to-transparent"
              />
              <MetricCard
                label="Ticket Médio"
                value={metrics.isLoading ? "—" : formatBRL(metrics.data?.ticket_medio ?? 0)}
                hint="Valor fechado / fechados."
                icon={<MessageSquareTextIcon className="size-4" />}
                accent="from-blue-300/18 via-blue-300/0 to-transparent"
              />

              <MetricCard
                className="lg:col-span-4"
                label="Agenda"
                value={events.isLoading ? "—" : upcoming}
                hint="Próximos compromissos no calendário."
                icon={<CalendarIcon className="size-4" />}
                accent="from-violet-300/18 via-violet-300/0 to-transparent"
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <div className="text-base font-semibold tracking-tight text-white">Insights</div>
              <p className="text-sm text-white/60">
                Gráficos com dados reais do seu funil (multi-tenant).
              </p>
            </div>
            <DashboardCharts />
          </motion.div>

          <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
            <PremiumSurface>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold tracking-tight text-white">Primeiros passos</div>
                      <Badge className="border-white/10 bg-white/5 text-white/70" variant="secondary">
                        MVP
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">
                      Configure o básico e comece a operar com consistência.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span className="text-white/70">1) Cadastre 5 veículos do seu estoque</span>
                    <Button asChild variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Link href="/app/veiculos/novo">Cadastrar</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span className="text-white/70">2) Registre os leads que já estão no WhatsApp</span>
                    <Button asChild variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Link href="/app/leads/novo">Registrar</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span className="text-white/70">3) Marque retornos na agenda</span>
                    <Button asChild variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Link href="/app/agenda">Abrir</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </PremiumSurface>

            <PremiumSurface>
              <div className="p-6">
                <div className="space-y-1">
                  <div className="text-base font-semibold tracking-tight text-white">Boas práticas</div>
                  <p className="text-sm text-white/60">
                    O que as revendas que mais vendem fazem todo dia.
                  </p>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/65">
                  <li>Lead respondido em até 5 minutos tem muito mais chance de virar venda.</li>
                  <li>Tenha um “próximo passo” claro para cada lead (visita, proposta, retorno).</li>
                  <li>Padronize status: facilita relatórios e previsibilidade.</li>
                </ul>
              </div>
            </PremiumSurface>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  icon: React.ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <PremiumSurface className={className}>
      <div className="relative overflow-hidden p-6">
        <div className={["pointer-events-none absolute inset-0 opacity-100", `bg-linear-to-br ${accent}`].join(" ")} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
            {label}
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
            {icon}
          </div>
        </div>
        <div className="relative mt-3 text-4xl font-semibold tracking-tight text-white">
          {value}
        </div>
        <div className="relative mt-1 text-xs text-white/55">{hint}</div>
      </div>
    </PremiumSurface>
  );
}

