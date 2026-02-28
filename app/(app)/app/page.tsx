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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/features/events/hooks";
import { useDashboardMetrics } from "@/features/dashboard/hooks";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão rápida do dia: estoque, leads e próximos compromissos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/leads/novo">Novo lead</Link>
          </Button>
          <Button asChild>
            <Link href="/app/veiculos/novo">
              Novo veículo <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-xl bg-background/50 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-base font-semibold tracking-tight">Ações rápidas</div>
            <p className="text-sm text-muted-foreground">
              Atalhos para executar as rotinas mais comuns.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
            <Button asChild variant="outline" className="justify-start sm:justify-center">
              <Link href="/app/veiculos/novo">
                <CarIcon className="mr-2 size-4" />
                Novo veículo
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start sm:justify-center">
              <Link href="/app/leads/novo">
                <UsersIcon className="mr-2 size-4" />
                Novo lead
              </Link>
            </Button>
            <Button asChild className="justify-start sm:justify-center">
              <Link href="/app/pipeline">
                <LayoutGridIcon className="mr-2 size-4" />
                Ver Pipeline
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Leads
            </div>
            <UsersIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : metrics.data?.total_leads ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Leads registrados na sua empresa.
          </div>
        </Card>
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Em Negociação
            </div>
            <HandshakeIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : metrics.data?.leads_em_negociacao ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Leads na etapa de negociação.
          </div>
        </Card>
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Fechados
            </div>
            <TrendingUpIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : metrics.data?.leads_fechados ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Leads marcados como fechados.
          </div>
        </Card>
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Conversão
            </div>
            <BarChart3Icon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : pct(metrics.data?.taxa_conversao ?? 0)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Fechados / total de leads.</div>
        </Card>

        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valor em Negociação
            </div>
            <WalletIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading
              ? "—"
              : formatBRL(metrics.data?.valor_em_negociacao ?? 0)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Soma de FIPE dos leads ainda não fechados (quando disponível).
          </div>
        </Card>
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valor Fechado
            </div>
            <WalletIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : formatBRL(metrics.data?.valor_fechado ?? 0)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Soma de FIPE dos fechados.</div>
        </Card>
        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ticket Médio
            </div>
            <MessageSquareTextIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {metrics.isLoading ? "—" : formatBRL(metrics.data?.ticket_medio ?? 0)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Valor fechado / fechados.</div>
        </Card>

        <Card className="rounded-xl bg-background/50 p-6 shadow-sm transition hover:shadow-md lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Agenda
            </div>
            <CalendarIcon className="size-4 text-muted-foreground/80" />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {events.isLoading ? "—" : upcoming}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Agende retornos e test-drives com contexto.
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-background/60 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-base font-medium">Primeiros passos</div>
                <Badge variant="secondary">MVP</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure o básico e comece a operar.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>1) Cadastre 5 veículos do seu estoque</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/veiculos/novo">Cadastrar</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>2) Registre os leads que já estão no WhatsApp</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/leads/novo">Registrar</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>3) Marque retornos na agenda</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/agenda">Abrir</Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-background/60 p-6">
          <div className="space-y-1">
            <div className="text-base font-medium">Boas práticas</div>
            <p className="text-sm text-muted-foreground">
              O que as revendas que mais vendem fazem todo dia.
            </p>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Lead respondido em até 5 minutos tem muito mais chance de virar venda.</li>
            <li>Tenha um “próximo passo” claro para cada lead (visita, proposta, retorno).</li>
            <li>Padronize status: facilita relatórios e previsibilidade.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

