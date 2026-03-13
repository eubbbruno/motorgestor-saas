"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClockIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  ListTodoIcon,
  UsersIcon,
  CarIcon,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { Button } from "@/components/ui/button";
import { useDashboardCharts } from "@/features/dashboard/hooks";
import { useEvents } from "@/features/events/hooks";
import type { LeadRow, VehicleRow } from "@/types/models";

type PendingTaskRow = {
  id: string;
  title: string;
  due_date: string | null;
  lead_id: string;
  leads?: Array<{ name: string }> | null;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
}

function formatDate(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
}

function cnJoin(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function WidgetHeader({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">{title}</div>
        <div className="text-sm text-white/60">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
          {icon}
        </div>
        {href ? (
          <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href={href}>
              Abrir <ChevronRightIcon className="ml-1 size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function PipelineSummaryWidget({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const charts = useDashboardCharts();
  const funnel = charts.data?.funnel ?? [];
  const total = funnel.reduce((acc, i) => acc + Number(i.count ?? 0), 0) || 1;

  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={compact ? "p-5" : "p-6"}
      >
        <WidgetHeader
          title="Pipeline"
          description="Resumo por etapa"
          icon={<LayoutGridIcon className="size-4" />}
          href="/app/pipeline"
        />
        <div className="mt-4 space-y-2">
          {charts.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : charts.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar o pipeline.</div>
          ) : (
            funnel.slice(0, compact ? 4 : 6).map((s) => {
              const pct = Math.round((Number(s.count ?? 0) / total) * 100);
              return (
                <div key={s.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/65">
                    <span className="truncate">{s.label}</span>
                    <span className="font-medium text-white/80">{s.count}</span>
                  </div>
                  <div className={compact ? "h-1.5 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10" : "h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10"}>
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-400/55 via-blue-400/35 to-violet-400/25"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function NextAgendaWidget({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const events = useEvents();
  const upcoming = React.useMemo(() => {
    const now = Date.now();
    const list = (events.data ?? [])
      .filter((e) => new Date(e.start_at).getTime() >= now)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    return list.slice(0, compact ? 3 : 4);
  }, [compact, events.data]);

  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={compact ? "p-5" : "p-6"}
      >
        <WidgetHeader
          title="Agenda"
          description="Próximos compromissos"
          icon={<CalendarClockIcon className="size-4" />}
          href="/app/agenda"
        />
        <div className="mt-4 space-y-2">
          {events.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : events.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar a agenda.</div>
          ) : upcoming.length === 0 ? (
            <div className="text-sm text-white/55">Sem compromissos próximos.</div>
          ) : (
            upcoming.map((e) => (
              <div key={e.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="text-sm font-medium text-white">{e.title}</div>
                <div className="text-xs text-white/55">{formatDateTime(e.start_at)}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function RecentLeadsWidget() {
  const reduceMotion = useReducedMotion();

  const q = useQuery({
    queryKey: ["dashboard", "recent-leads"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, status, created_at, phone")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as Pick<LeadRow, "id" | "name" | "status" | "created_at" | "phone">[];
    },
    staleTime: 30_000,
  });

  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="p-6"
      >
        <WidgetHeader
          title="Leads recentes"
          description="Últimos cadastrados"
          icon={<UsersIcon className="size-4" />}
          href="/app/leads"
        />
        <div className="mt-4 space-y-2">
          {q.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar leads.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhum lead ainda.</div>
          ) : (
            q.data!.map((l) => (
              <Link
                key={l.id}
                href={`/app/leads/${l.id}`}
                className={cnJoin(
                  "block rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition",
                  "hover:bg-white/10",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">{l.name}</div>
                    <div className="text-xs text-white/55">
                      {formatDate(l.created_at)} · {String(l.status)}
                    </div>
                  </div>
                  <ChevronRightIcon className="size-4 text-white/40" />
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function RecentVehiclesWidget() {
  const reduceMotion = useReducedMotion();

  const q = useQuery({
    queryKey: ["dashboard", "recent-vehicles"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, title, year, price, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as Pick<VehicleRow, "id" | "title" | "year" | "price" | "created_at" | "status">[];
    },
    staleTime: 30_000,
  });

  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="p-6"
      >
        <WidgetHeader
          title="Veículos"
          description="Adicionados recentemente"
          icon={<CarIcon className="size-4" />}
          href="/app/veiculos"
        />
        <div className="mt-4 space-y-2">
          {q.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar veículos.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhum veículo ainda.</div>
          ) : (
            q.data!.map((v) => (
              <Link
                key={v.id}
                href={`/app/veiculos/${v.id}`}
                className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">
                      {v.title}
                    </div>
                    <div className="text-xs text-white/55">
                      {v.year ? `${v.year} · ` : ""}
                      {String(v.status)} · {formatDate(v.created_at)}
                    </div>
                  </div>
                  <ChevronRightIcon className="size-4 text-white/40" />
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function PendingTasksWidget() {
  const reduceMotion = useReducedMotion();

  const q = usePendingTasks();

  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="p-6"
      >
        <WidgetHeader
          title="Tarefas"
          description={q.data ? `${q.data.total} pendentes` : "Pendentes"}
          icon={<ListTodoIcon className="size-4" />}
          href="/app/agenda"
        />
        <div className="mt-4 space-y-2">
          {q.isLoading ? (
            <div className="text-sm text-white/55">Carregando...</div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar tarefas.</div>
          ) : (q.data?.rows.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhuma tarefa pendente.</div>
          ) : (
            q.data!.rows.map((t) => (
              <Link
                key={t.id}
                href={`/app/leads/${t.lead_id}`}
                className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">{t.title}</div>
                    <div className="text-xs text-white/55">
                      {t.leads?.[0]?.name ? `${t.leads[0].name} · ` : ""}
                      {t.due_date ? `Vence: ${formatDate(t.due_date)}` : "Sem vencimento"}
                    </div>
                  </div>
                  <ChevronRightIcon className="size-4 text-white/40" />
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function usePendingTasks() {
  return useQuery({
    queryKey: ["dashboard", "pending-tasks"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error, count } = await supabase
        .from("lead_tasks")
        .select("id, title, due_date, lead_id, leads(name)", { count: "exact" })
        .eq("status", "pending")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(5);
      if (error) throw error;
      return { rows: (data ?? []) as PendingTaskRow[], total: Number(count ?? 0) };
    },
    staleTime: 30_000,
  });
}

