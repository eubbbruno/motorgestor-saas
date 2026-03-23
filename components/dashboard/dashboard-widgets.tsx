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
  MessageSquareTextIcon,
  PhoneCallIcon,
  RefreshCcwIcon,
  BadgeCheckIcon,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardCharts, useDashboardMetrics } from "@/features/dashboard/hooks";
import { useEvents } from "@/features/events/hooks";
import type { LeadRow, VehicleRow } from "@/types/models";

type PendingTaskRow = {
  id: string;
  title: string;
  due_date: string | null;
  lead_id: string;
  leads?: Array<{ name: string }> | null;
};

type LeadEventRow = {
  id: string;
  lead_id: string;
  type:
    | "created"
    | "note"
    | "status_change"
    | "call"
    | "visit"
    | "sale"
    | "whatsapp"
    | string;
  message: string | null;
  created_at: string;
  leads?: Array<{ id?: string; name?: string; status?: string }> | null;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
}

function formatDate(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
}

function formatTime(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);
}

function cnJoin(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function eventMeta(type: LeadEventRow["type"]) {
  switch (type) {
    case "whatsapp":
      return { label: "WhatsApp", icon: <MessageSquareTextIcon className="size-4" /> };
    case "call":
      return { label: "Ligação", icon: <PhoneCallIcon className="size-4" /> };
    case "status_change":
      return { label: "Status", icon: <RefreshCcwIcon className="size-4" /> };
    case "sale":
      return { label: "Venda", icon: <BadgeCheckIcon className="size-4" /> };
    case "note":
      return { label: "Nota", icon: <MessageSquareTextIcon className="size-4" /> };
    default:
      return { label: "Atividade", icon: <MessageSquareTextIcon className="size-4" /> };
  }
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

export function RecentActivityWidget() {
  const reduceMotion = useReducedMotion();
  const charts = useDashboardCharts();
  const funnel = charts.data?.funnel ?? [];
  const funnelTotal = funnel.reduce((acc, i) => acc + Number(i.count ?? 0), 0) || 1;

  const q = useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lead_events")
        .select("id, lead_id, type, message, created_at, leads(id, name, status)")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as LeadEventRow[];
    },
    staleTime: 15_000,
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
          title="Atividade recente"
          description="WhatsApp, notas e mudanças do funil"
          icon={<MessageSquareTextIcon className="size-4" />}
          href="/app/leads"
        />

        <div className="mt-4">
          {charts.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-2 w-full rounded-full bg-white/10" />
              <div className="flex justify-between text-[11px] text-white/45">
                <Skeleton className="h-3 w-20 bg-white/10" />
                <Skeleton className="h-3 w-16 bg-white/10" />
              </div>
            </div>
          ) : charts.isError || funnel.length === 0 ? null : (
            <div className="space-y-2">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                {funnel.slice(0, 6).map((s) => {
                  const w = Math.max(3, Math.round((Number(s.count ?? 0) / funnelTotal) * 100));
                  return (
                    <div
                      key={s.status}
                      className="h-full"
                      style={{
                        width: `${w}%`,
                        background:
                          s.status === "fechado"
                            ? "linear-gradient(90deg, rgba(52,211,153,0.75), rgba(52,211,153,0.28))"
                            : s.status === "perdido"
                              ? "linear-gradient(90deg, rgba(248,113,113,0.55), rgba(248,113,113,0.18))"
                              : "linear-gradient(90deg, rgba(59,130,246,0.45), rgba(168,85,247,0.22))",
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/55">
                <div>Mini funil (compacto)</div>
                <div className="tabular-nums">{funnelTotal} leads</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          {q.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-9 w-9 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                    <Skeleton className="h-3 w-1/2 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar a atividade.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Sem eventos ainda.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {q.data!.slice(0, 8).map((e) => {
                const meta = eventMeta(e.type);
                const leadId = e.leads?.[0]?.id ?? e.lead_id;
                const leadName = e.leads?.[0]?.name ?? "Lead";
                const msg = (e.message ?? "").trim();
                return (
                  <Link
                    key={e.id}
                    href={leadId ? `/app/leads/${leadId}` : "/app/leads"}
                    className="block -mx-2 rounded-lg px-2 py-3 transition hover:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
                        {meta.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate text-sm font-medium text-white">
                            {leadName}
                            <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                              {meta.label}
                            </span>
                          </div>
                          <div className="shrink-0 text-xs tabular-nums text-white/45">
                            {formatTime(e.created_at)}
                          </div>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-white/55">
                          {msg || "Atualização registrada."}
                        </div>
                      </div>
                      <ChevronRightIcon className="mt-2 size-4 text-white/35" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function LeadsTodayWidget() {
  const reduceMotion = useReducedMotion();

  const q = useQuery({
    queryKey: ["dashboard", "leads-today"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, status, created_at")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Pick<LeadRow, "id" | "name" | "status" | "created_at">[];
    },
    staleTime: 10_000,
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
          title="Leads do dia"
          description="Entrada de hoje"
          icon={<UsersIcon className="size-4" />}
          href="/app/leads"
        />
        <div className="mt-4">
          {q.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-2">
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <Skeleton className="h-3 w-10 bg-white/10" />
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar leads do dia.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhum lead hoje.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {q.data!.slice(0, 7).map((l) => (
                <Link
                  key={l.id}
                  href={`/app/leads/${l.id}`}
                  className="block -mx-2 rounded-lg px-2 py-2 transition hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">{l.name}</div>
                      <div className="text-xs text-white/55">{String(l.status)}</div>
                    </div>
                    <div className="shrink-0 text-xs tabular-nums text-white/45">
                      {formatTime(l.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </PremiumSurface>
  );
}

export function PerformanceWidget() {
  const reduceMotion = useReducedMotion();
  const metrics = useDashboardMetrics();

  const daily = useQuery({
    queryKey: ["dashboard", "performance-daily"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const startIso = start.toISOString();

      const [leadsToday, closedToday] = await Promise.all([
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", startIso),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", "fechado")
          .gte("created_at", startIso),
      ]);

      if (leadsToday.error) throw leadsToday.error;
      if (closedToday.error) throw closedToday.error;
      return {
        leadsToday: Number(leadsToday.count ?? 0),
        closedToday: Number(closedToday.count ?? 0),
      };
    },
    staleTime: 10_000,
  });

  // useDashboardMetrics já existe no /app/page.tsx; aqui vamos ler por prop? Para não alterar muito,
  // exibimos performance diária + um micro texto orientado a execução.
  return (
    <PremiumSurface>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="p-6"
      >
        <WidgetHeader
          title="Performance"
          description="Hoje (execução)"
          icon={<BadgeCheckIcon className="size-4" />}
        />

        <div className="mt-4">
          {daily.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-28 bg-white/10" />
              <div className="grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>
          ) : daily.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar performance.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-4">
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {metrics.isLoading ? "—" : `${Math.round((metrics.data?.taxa_conversao ?? 0) * 100)}%`}
                </div>
                <div className="text-xs text-white/55">taxa de conversão</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                    Leads novos (hoje)
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white tabular-nums">
                    {daily.data?.leadsToday ?? 0}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                    Fechados (hoje)
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white tabular-nums">
                    {daily.data?.closedToday ?? 0}
                  </div>
                </div>
              </div>
              {/* touch: evita sensação de vazio e mantém “produto” */}
              <div className="text-xs text-white/45">
                Execução sugerida: mova 3 leads para “Contato” e envie mensagem inicial.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </PremiumSurface>
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
            <div className="space-y-3">
              {Array.from({ length: compact ? 4 : 5 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-3 w-28 bg-white/10" />
                    <Skeleton className="h-3 w-8 bg-white/10" />
                  </div>
                  <Skeleton className={compact ? "h-1.5 w-full rounded-full bg-white/10" : "h-2 w-full rounded-full bg-white/10"} />
                </div>
              ))}
            </div>
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
            <div className="space-y-2">
              {Array.from({ length: compact ? 3 : 4 }).map((_, idx) => (
                <div key={idx} className="space-y-2 py-2 first:pt-0 last:pb-0">
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          ) : events.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar a agenda.</div>
          ) : upcoming.length === 0 ? (
            <div className="text-sm text-white/55">Sem compromissos próximos.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {upcoming.map((e) => (
                <div key={e.id} className="py-2 first:pt-0 last:pb-0">
                  <div className="text-sm font-medium text-white">{e.title}</div>
                  <div className="text-xs text-white/55">{formatDateTime(e.start_at)}</div>
                </div>
              ))}
            </div>
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
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="py-2">
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-1/3 bg-white/10" />
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar leads.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhum lead ainda.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {q.data!.map((l) => (
                <Link
                  key={l.id}
                  href={`/app/leads/${l.id}`}
                  className={cnJoin(
                    "block -mx-2 rounded-lg px-2 py-2 transition",
                    "hover:bg-white/5",
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
              ))}
            </div>
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
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="py-2">
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-1/3 bg-white/10" />
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar veículos.</div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhum veículo ainda.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {q.data!.map((v) => (
                <Link
                  key={v.id}
                  href={`/app/veiculos/${v.id}`}
                  className="block -mx-2 rounded-lg px-2 py-2 transition hover:bg-white/5"
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
              ))}
            </div>
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
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="py-2">
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <div className="text-sm text-red-300">Não foi possível carregar tarefas.</div>
          ) : (q.data?.rows.length ?? 0) === 0 ? (
            <div className="text-sm text-white/55">Nenhuma tarefa pendente.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {q.data!.rows.map((t) => (
                <Link
                  key={t.id}
                  href={`/app/leads/${t.lead_id}`}
                  className="block -mx-2 rounded-lg px-2 py-2 transition hover:bg-white/5"
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
              ))}
            </div>
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

