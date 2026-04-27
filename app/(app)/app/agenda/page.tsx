"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Calendar, dateFnsLocalizer, type Event as RBCEvent, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useQuery } from "@tanstack/react-query";

import { useEvents, useCreateEvent, useDeleteEvent } from "@/features/events/hooks";
import { EventFormSchema, type EventFormValues } from "@/features/events/schema";
import { useLeads } from "@/features/leads/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

type TaskRow = {
  id: string;
  lead_id: string;
  title: string;
  status: "pending" | "done" | "cancelled";
  due_date: string | null; // YYYY-MM-DD
  leads?: Array<{ name: string }> | null;
};

type TaskCalendarEvent = RBCEvent & {
  taskId: string;
  leadId: string;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales: { "pt-BR": ptBR },
});

export default function AgendaPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const leads = useLeads();
  const events = useEvents();
  const create = useCreateEvent();
  const del = useDeleteEvent();

  const [open, setOpen] = React.useState(false);
  const [taskFilter, setTaskFilter] = React.useState<"pending" | "all" | "overdue">("pending");
  const [view, setView] = React.useState<View>("month");
  const [date, setDate] = React.useState<Date>(new Date());

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: "",
      start_at: "",
      end_at: "",
      lead_id: "",
      location: "",
      notes: "",
    },
  });

  async function onSubmit(values: EventFormValues) {
    if (!profile.data?.company_id) {
      toast.error("Sua empresa ainda não está configurada.");
      return;
    }

    try {
      await create.mutateAsync({
        values,
        companyId: profile.data.company_id,
        userId: profile.data.id,
      });
      toast.success("Evento criado.");
      form.reset();
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Tente novamente.";
      toast.error("Não foi possível criar o evento.", { description: message });
    }
  }

  const tasksQuery = useQuery({
    queryKey: ["agenda", "lead_tasks", taskFilter],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      let q = supabase
        .from("lead_tasks")
        .select("id, lead_id, title, status, due_date, leads(name)")
        .not("due_date", "is", null)
        .order("due_date", { ascending: true });

      if (taskFilter === "pending" || taskFilter === "overdue") q = q.eq("status", "pending");

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as TaskRow[];
    },
  });

  const todayISO = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const taskEvents = React.useMemo<TaskCalendarEvent[]>(() => {
    const list = tasksQuery.data ?? [];
    const filtered =
      taskFilter === "overdue"
        ? list.filter((t) => t.status === "pending" && Boolean(t.due_date) && String(t.due_date) < todayISO)
        : list;

    return filtered
      .filter((t) => Boolean(t.due_date))
      .map((t) => {
        const d = new Date(`${t.due_date}T00:00:00`);
        const leadName = t.leads?.[0]?.name ?? "Lead";
        return {
          title: `${t.title} · ${leadName}`,
          start: d,
          end: d,
          allDay: true,
          taskId: t.id,
          leadId: t.lead_id,
        };
      });
  }, [tasksQuery.data, taskFilter, todayISO]);

  const { overdueTasks, upcomingTasks } = React.useMemo(() => {
    const list = (tasksQuery.data ?? []).filter((t) => t.status === "pending" && Boolean(t.due_date));
    const overdue = list
      .filter((t) => String(t.due_date) < todayISO)
      .slice()
      .sort((a, b) => (String(a.due_date) > String(b.due_date) ? 1 : -1))
      .slice(0, 8);

    const upcoming = list
      .filter((t) => String(t.due_date) >= todayISO)
      .slice()
      .sort((a, b) => (String(a.due_date) > String(b.due_date) ? 1 : -1))
      .slice(0, 8);

    return { overdueTasks: overdue, upcomingTasks: upcoming };
  }, [tasksQuery.data, todayISO]);

  function formatDue(value: string | null) {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T00:00:00`));
    } catch {
      return value;
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Rotina"
        title="Agenda"
        description="Retornos, visitas e test-drives com contexto."
        right={
          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <PlusIcon className="mr-2 size-4" />
            Novo evento
          </Button>
        }
      />

      <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-base font-medium">Calendário de tarefas</div>
            <div className="text-sm text-mg-fg-muted">
              Visualize vencimentos de follow-ups e clique para abrir o lead.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={taskFilter}
              onValueChange={(v) => setTaskFilter(v as "pending" | "all" | "overdue")}
            >
              <TabsList>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={() => tasksQuery.refetch()}
              disabled={tasksQuery.isFetching}
            >
              {tasksQuery.isFetching ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {tasksQuery.isLoading ? (
            <div className="text-sm text-mg-fg-muted">Carregando calendário...</div>
          ) : tasksQuery.isError ? (
            <div className="text-sm text-red-300">
              Não foi possível carregar tarefas do calendário. A migração `lead_tasks` já foi aplicada?
            </div>
          ) : (
            <div className="rounded-2xl border border-mg-border bg-mg-surface/55 p-3 backdrop-blur">
              <Calendar
                localizer={localizer}
                culture="pt-BR"
                events={taskEvents}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={(v) => setView(v)}
                date={date}
                onNavigate={(d) => setDate(d)}
                style={{ height: 460 }}
                popup
                onSelectEvent={(e) => {
                  const ev = e as TaskCalendarEvent;
                  router.push(`/app/leads/${ev.leadId}`);
                  router.refresh();
                }}
                messages={{
                  next: "Próximo",
                  previous: "Anterior",
                  today: "Hoje",
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                  agenda: "Agenda",
                  date: "Data",
                  time: "Hora",
                  event: "Evento",
                  noEventsInRange: "Sem tarefas com vencimento neste período.",
                  showMore: (total) => `+${total} mais`,
                }}
              />
            </div>
          )}
        </div>

        {tasksQuery.isLoading || tasksQuery.isError ? null : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-mg-border bg-mg-surface/55 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Tarefas atrasadas</div>
                <div className="text-xs text-mg-fg-muted">{overdueTasks.length}</div>
              </div>
              <div className="mt-3 space-y-2">
                {overdueTasks.length ? (
                  overdueTasks.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        router.push(`/app/leads/${t.lead_id}`);
                        router.refresh();
                      }}
                      className="flex w-full items-start justify-between gap-3 rounded-xl border border-mg-border bg-mg-surface/60 px-3 py-2 text-left hover:bg-mg-surface-2/70"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.title}</div>
                        <div className="mt-0.5 truncate text-xs text-mg-fg-muted">
                          {t.leads?.[0]?.name ?? "Lead"}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs font-medium text-destructive">
                        {formatDue(t.due_date)}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-mg-fg-muted">Nenhuma tarefa atrasada.</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-mg-border bg-mg-surface/55 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Próximas tarefas</div>
                <div className="text-xs text-mg-fg-muted">{upcomingTasks.length}</div>
              </div>
              <div className="mt-3 space-y-2">
                {upcomingTasks.length ? (
                  upcomingTasks.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        router.push(`/app/leads/${t.lead_id}`);
                        router.refresh();
                      }}
                      className="flex w-full items-start justify-between gap-3 rounded-xl border border-mg-border bg-mg-surface/60 px-3 py-2 text-left hover:bg-mg-surface-2/70"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.title}</div>
                        <div className="mt-0.5 truncate text-xs text-mg-fg-muted">
                          {t.leads?.[0]?.name ?? "Lead"}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs font-medium text-mg-fg-muted">
                        {formatDue(t.due_date)}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-mg-fg-muted">Sem tarefas pendentes com vencimento.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
      </PremiumSurface>

      <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none sm:p-6">
        {events.isLoading ? (
          <div className="text-sm text-mg-fg-muted">Carregando...</div>
        ) : events.isError ? (
          <div className="text-sm text-red-300">
            Não foi possível carregar a agenda.
          </div>
        ) : events.data?.length ? (
          <div className="grid gap-3">
            {events.data.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-2 rounded-2xl border border-mg-border bg-mg-surface/55 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-mg-fg-muted" />
                    <div className="truncate font-medium">{e.title}</div>
                  </div>
                  <div className="mt-1 text-xs text-mg-fg-muted">
                    {new Date(e.start_at).toLocaleString("pt-BR")}
                    {e.end_at ? ` → ${new Date(e.end_at).toLocaleString("pt-BR")}` : ""}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await del.mutateAsync(e.id);
                      toast.success("Evento removido.");
                    } catch {
                      toast.error("Não foi possível remover o evento.");
                    }
                  }}
                  disabled={del.isPending}
                >
                  <TrashIcon className="mr-2 size-4" />
                  Remover
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-mg-fg-muted">
              Sem eventos por enquanto.
            </div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Criar primeiro evento
            </Button>
          </div>
        )}
      </Card>
      </PremiumSurface>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo evento</DialogTitle>
            <DialogDescription>
              Agende retorno/visita e vincule a um lead se fizer sentido.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Ex: Test-drive com João" {...form.register("title")} />
              {form.formState.errors.title ? (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_at">Início</Label>
                <Input id="start_at" type="datetime-local" {...form.register("start_at")} />
                {form.formState.errors.start_at ? (
                  <p className="text-xs text-destructive">{form.formState.errors.start_at.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_at">Fim (opcional)</Label>
                <Input id="end_at" type="datetime-local" {...form.register("end_at")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lead (opcional)</Label>
              <Select
                value={form.watch("lead_id") || "__none__"}
                onValueChange={(v) => form.setValue("lead_id", v === "__none__" ? "" : v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={leads.isLoading ? "Carregando..." : "Selecionar lead"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {(leads.data ?? []).map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local (opcional)</Label>
              <Input id="location" placeholder="Showroom, endereço..." {...form.register("location")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" rows={4} {...form.register("notes")} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Criando..." : "Criar evento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

