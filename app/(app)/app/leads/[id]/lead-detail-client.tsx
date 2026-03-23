"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import {
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  PhoneCallIcon,
  RefreshCcwIcon,
  TrashIcon,
} from "lucide-react";

import { LeadForm } from "@/features/leads/lead-form";
import type { LeadFormValues } from "@/features/leads/schema";
import { useLead, useUpdateLead, useDeleteLead } from "@/features/leads/hooks";
import { useCreateLeadEvent, useLeadEvents } from "@/features/leads/events-hooks";
import { useCreateLeadTask, useDeleteTask, useLeadTasks, usePatchTask } from "@/features/leads/tasks-hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  buildLeadWhatsAppTemplateText,
  buildWhatsAppLink,
  copyTextToClipboard,
  type WhatsAppLeadTemplateKey,
} from "@/lib/whatsapp";
import { useLeadWhatsAppHistory } from "@/features/leads/whatsapp-history-hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

type EventType = "created" | "note" | "status_change" | "call" | "visit" | "sale" | "whatsapp";

const eventLabels: Record<EventType, string> = {
  created: "Criado",
  note: "Comentário",
  status_change: "Mudança de status",
  call: "Ligação",
  visit: "Visita",
  sale: "Venda",
  whatsapp: "WhatsApp",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function LeadDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const lead = useLead(id);
  const vehicles = useVehicles();
  const update = useUpdateLead();
  const del = useDeleteLead();
  const events = useLeadEvents(id);
  const createEvent = useCreateLeadEvent();
  const waHistory = useLeadWhatsAppHistory(id);
  const tasks = useLeadTasks(id);
  const createTask = useCreateLeadTask();
  const patchTask = usePatchTask();
  const deleteTask = useDeleteTask();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDue, setTaskDue] = React.useState<string>("");

  const [waOpen, setWaOpen] = React.useState(false);
  const [waTemplate, setWaTemplate] = React.useState<WhatsAppLeadTemplateKey>("initial");
  const [copied, setCopied] = React.useState(false);
  const [waAutoFollowup, setWaAutoFollowup] = React.useState(false);
  const [waTaskCreated, setWaTaskCreated] = React.useState(false);

  const vehicleTitle = React.useMemo(() => {
    const vid = lead.data?.vehicle_id ?? null;
    if (!vid) return null;
    const v = (vehicles.data ?? []).find((x) => x.id === vid);
    return v?.title ?? null;
  }, [lead.data?.vehicle_id, vehicles.data]);

  const waText = React.useMemo(() => {
    if (!lead.data) return "";
    return buildLeadWhatsAppTemplateText({
      template: waTemplate,
      leadName: lead.data.name,
      vehicleTitle,
    });
  }, [lead.data, vehicleTitle, waTemplate]);

  const whatsappLink = React.useMemo(() => {
    return buildWhatsAppLink({ phone: lead.data?.phone ?? null, text: waText });
  }, [lead.data?.phone, waText]);

  function addDaysIso(days: number) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function templateLabel(t: WhatsAppLeadTemplateKey) {
    switch (t) {
      case "initial":
        return "Mensagem inicial";
      case "follow_up":
        return "Follow-up";
      case "proposal":
        return "Proposta";
      case "schedule":
        return "Agendar visita/test drive";
      case "hot":
        return "Oportunidade quente";
      case "objection_price":
        return "Preço / objeção";
      default:
        return "WhatsApp";
    }
  }

  async function maybeCreateFollowupTask() {
    if (!waAutoFollowup || waTaskCreated) return;
    if (!lead.data) return;
    try {
      await createTask.mutateAsync({
        leadId: id,
        title: `Follow-up WhatsApp • ${templateLabel(waTemplate)}`,
        due_date: addDaysIso(1),
      });
      setWaTaskCreated(true);
      toast.success("Follow-up agendado para amanhã.");
    } catch {
      // não bloqueia uso do WhatsApp
      toast.error("Não foi possível agendar o follow-up.");
    }
  }

  async function logWhatsAppInteraction(template: WhatsAppLeadTemplateKey) {
    if (!lead.data) return;
    const msg = buildLeadWhatsAppTemplateText({
      template,
      leadName: lead.data.name,
      vehicleTitle,
    });
    try {
      await createEvent.mutateAsync({
        leadId: id,
        type: "whatsapp",
        message: msg,
      });
      void waHistory.refetch();
    } catch {
      // não bloqueia uso do WhatsApp
    }
  }

  async function onSubmit(values: LeadFormValues) {
    const prev = lead.data?.status ?? null;
    const l = await update.mutateAsync({ id, values });

    if (prev && prev !== l.status) {
      try {
        await createEvent.mutateAsync({
          leadId: id,
          type: "status_change",
          message: `Status: ${String(prev)} → ${String(l.status)}`,
        });
      } catch {
        // não bloqueia atualização do lead
      }
    }

    toast.success("Lead atualizado.");
    router.push(`/app/leads/${l.id}`);
    router.refresh();
  }

  async function onDelete() {
    try {
      await del.mutateAsync(id);
      toast.success("Lead removido.");
      router.push("/app/leads");
      router.refresh();
    } catch {
      toast.error("Não foi possível remover o lead.");
    } finally {
      setConfirmOpen(false);
    }
  }

  const defaultValues: Partial<LeadFormValues> | undefined = lead.data
    ? {
        name: lead.data.name,
        phone: lead.data.phone ?? "",
        email: lead.data.email ?? "",
        source: lead.data.source ?? "",
        status: lead.data.status,
        vehicle_id: lead.data.vehicle_id ?? "",
        notes: lead.data.notes ?? "",
      }
    : undefined;

  async function addNote() {
    const msg = note.trim();
    if (!msg) {
      toast.error("Digite um comentário.");
      return;
    }
    try {
      await createEvent.mutateAsync({ leadId: id, type: "note", message: msg });
      setNote("");
      toast.success("Comentário adicionado.");
    } catch {
      toast.error("Não foi possível adicionar comentário.");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  function formatDueDate(value: string) {
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T00:00:00`));
    } catch {
      return value;
    }
  }

  async function addTask() {
    const title = taskTitle.trim();
    if (!title) {
      toast.error("Informe um título para a tarefa.");
      return;
    }
    try {
      await createTask.mutateAsync({
        leadId: id,
        title,
        due_date: taskDue ? taskDue : null,
      });
      setTaskTitle("");
      setTaskDue("");
      toast.success("Tarefa criada.");
    } catch {
      toast.error("Não foi possível criar a tarefa.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="CRM"
        title={lead.data?.name ? `Lead · ${lead.data.name}` : "Lead"}
        description="Atualize status, notas e mantenha histórico do atendimento."
        right={
          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:items-center">
            <Button
              asChild
              variant="outline"
              className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
            >
              <Link href="/app/leads">Voltar</Link>
            </Button>
            <div className="flex w-full sm:w-auto">
              <Button
                asChild
                className="w-full rounded-r-none bg-emerald-500 text-black hover:bg-emerald-400"
                disabled={!whatsappLink}
              >
                <a href={whatsappLink ?? "#"} target="_blank" rel="noreferrer">
                  <MessageCircleIcon className="mr-2 size-4" />
                  Conversar no WhatsApp
                </a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-l-none border-l border-black/10 bg-emerald-500 text-black hover:bg-emerald-400"
                    disabled={!lead.data?.phone}
                    size="icon"
                    aria-label="Opções de mensagem"
                    type="button"
                  >
                    <MessageSquareTextIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("initial");
                    setCopied(false);
                    setWaAutoFollowup(false);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("initial");
                    setWaOpen(true);
                  }}
                >
                  Mensagem inicial
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("follow_up");
                    setCopied(false);
                    setWaAutoFollowup(true);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("follow_up");
                    setWaOpen(true);
                  }}
                >
                  Follow-up
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("schedule");
                    setCopied(false);
                    setWaAutoFollowup(true);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("schedule");
                    setWaOpen(true);
                  }}
                >
                  Agendar visita/test drive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("hot");
                    setCopied(false);
                    setWaAutoFollowup(true);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("hot");
                    setWaOpen(true);
                  }}
                >
                  Oportunidade quente
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("objection_price");
                    setCopied(false);
                    setWaAutoFollowup(true);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("objection_price");
                    setWaOpen(true);
                  }}
                >
                  Preço / objeção
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWaTemplate("proposal");
                    setCopied(false);
                    setWaAutoFollowup(true);
                    setWaTaskCreated(false);
                    void logWhatsAppInteraction("proposal");
                    setWaOpen(true);
                  }}
                >
                  Proposta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
            >
              <Link href={`/app/proposta?leadId=${id}`}>Gerar proposta PDF</Link>
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <TrashIcon className="mr-2 size-4" />
              Remover
            </Button>
          </div>
        }
      />

      {lead.isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando...</div>
      ) : lead.isError ? (
        <div className="text-sm text-destructive">Não foi possível carregar o lead.</div>
      ) : lead.data ? (
        <>
          <LeadForm
            title="Detalhes do lead"
            submitLabel="Salvar alterações"
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            loading={update.isPending}
          />

          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareTextIcon className="size-4 text-muted-foreground" />
                <div className="text-base font-medium">Timeline</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => events.refetch()}
                disabled={events.isFetching}
              >
                {events.isFetching ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCcwIcon className="mr-2 size-4" />
                    Atualizar
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-12">
              <div className="space-y-2 md:col-span-8">
                <Label htmlFor="note">Adicionar comentário</Label>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="Escreva um comentário para registrar o atendimento..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={createEvent.isPending}
                />
              </div>
              <div className="md:col-span-4 md:pt-7">
                <Button className="w-full" onClick={addNote} disabled={createEvent.isPending}>
                  {createEvent.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Adicionar comentário"
                  )}
                </Button>
                <Button
                  className="mt-2 w-full"
                  variant="outline"
                  onClick={() =>
                    createEvent.mutateAsync({ leadId: id, type: "call", message: "Ligação registrada." }).catch(() => {
                      toast.error("Não foi possível registrar ligação.");
                    })
                  }
                  disabled={createEvent.isPending}
                >
                  <PhoneCallIcon className="mr-2 size-4" />
                  Registrar ligação
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {events.isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando timeline...</div>
              ) : events.isError ? (
                <div className="text-sm text-destructive">
                  Não foi possível carregar a timeline. A migração `lead_events` já foi aplicada?
                </div>
              ) : events.data?.length ? (
                <div className="space-y-3">
                  {events.data.map((e) => (
                    <div key={e.id} className="rounded-lg border bg-background/60 p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-medium">
                          <span className="inline-flex items-center gap-2">
                            {e.type === "whatsapp" ? (
                              <MessageCircleIcon className="size-4 text-emerald-600" />
                            ) : null}
                            {eventLabels[(e.type as EventType) ?? "note"] ?? (e.type === "whatsapp" ? "WhatsApp" : e.type)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{formatDate(e.created_at)}</div>
                      </div>
                      {e.message ? (
                        <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                          {e.message}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Nenhum evento ainda. Adicione um comentário para começar o histórico.
                </div>
              )}
            </div>
            </Card>
          </PremiumSurface>

          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageCircleIcon className="size-4 text-emerald-400" />
                <div className="text-base font-medium">Histórico WhatsApp</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => waHistory.refetch()}
                disabled={waHistory.isFetching}
              >
                {waHistory.isFetching ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCcwIcon className="mr-2 size-4" />
                    Atualizar
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {waHistory.isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando histórico...</div>
              ) : waHistory.isError ? (
                <div className="text-sm text-destructive">
                  Não foi possível carregar o histórico. A migração `lead_events_whatsapp` já foi aplicada?
                </div>
              ) : waHistory.data?.length ? (
                waHistory.data.slice(0, 10).map((h) => (
                  <div key={h.id} className="rounded-lg border bg-background/60 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-muted-foreground">{formatDate(h.created_at)}</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void copyTextToClipboard(h.message ?? "")
                            .then(() => toast.success("Mensagem copiada."))
                            .catch(() => toast.error("Não foi possível copiar."))
                        }
                        disabled={!h.message}
                      >
                        <CopyIcon className="mr-2 size-4" />
                        Copiar
                      </Button>
                    </div>
                    {h.message ? (
                      <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {h.message}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  Nenhuma interação registrada ainda. Use as opções de WhatsApp para criar um histórico.
                </div>
              )}
            </div>
            </Card>
          </PremiumSurface>

          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <div className="text-base font-medium">Tarefas / Follow-ups</div>
                <div className="text-sm text-muted-foreground">
                  Acompanhe próximos passos e vencimentos para não perder o timing.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => tasks.refetch()}
                disabled={tasks.isFetching}
              >
                {tasks.isFetching ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCcwIcon className="mr-2 size-4" />
                    Atualizar
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-12">
              <div className="space-y-2 md:col-span-8">
                <Label htmlFor="task-title">Nova tarefa</Label>
                <Input
                  id="task-title"
                  placeholder="Ex: Ligar amanhã às 10h e enviar proposta..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  disabled={createTask.isPending}
                />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label htmlFor="task-due">Vencimento</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  disabled={createTask.isPending}
                />
              </div>
              <div className="md:col-span-12">
                <Button className="w-full" onClick={addTask} disabled={createTask.isPending}>
                  {createTask.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Nova tarefa"
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {tasks.isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando tarefas...</div>
              ) : tasks.isError ? (
                <div className="text-sm text-destructive">
                  Não foi possível carregar as tarefas. A migração `lead_tasks` já foi aplicada?
                </div>
              ) : tasks.data?.length ? (
                <div className="space-y-2">
                  {tasks.data.map((t) => {
                    const overdue =
                      t.status === "pending" && Boolean(t.due_date) && String(t.due_date) < today;
                    const checked = t.status === "done";
                    return (
                      <div
                        key={t.id}
                        className="flex items-start gap-3 rounded-lg border bg-background/60 p-4"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            patchTask
                              .mutateAsync({ taskId: t.id, status: v ? "done" : "pending" })
                              .catch(() => toast.error("Não foi possível atualizar a tarefa."))
                          }
                          disabled={patchTask.isPending || deleteTask.isPending}
                          aria-label="Marcar como concluída"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={checked ? "text-sm font-medium line-through opacity-70" : "text-sm font-medium"}>
                              {t.title}
                            </div>
                            {overdue ? <Badge variant="destructive">Atrasada</Badge> : null}
                            {t.status === "cancelled" ? <Badge variant="secondary">Cancelada</Badge> : null}
                          </div>
                          {t.due_date ? (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Vence em {formatDueDate(String(t.due_date))}
                            </div>
                          ) : null}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            deleteTask
                              .mutateAsync(t.id)
                              .then(() => tasks.refetch())
                              .catch(() => toast.error("Não foi possível excluir a tarefa."))
                          }
                          disabled={deleteTask.isPending}
                          aria-label="Excluir tarefa"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Nenhuma tarefa ainda. Crie a primeira para organizar o próximo passo.
                </div>
              )}
            </div>
            </Card>
          </PremiumSurface>
        </>
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover lead</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O lead será removido do funil.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={del.isPending}>
              {del.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={waOpen}
        onOpenChange={(open) => {
          setWaOpen(open);
          if (!open) {
            setCopied(false);
            setWaTaskCreated(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mensagem pronta para vender</DialogTitle>
            <DialogDescription>
              Copie com 1 clique, abra no WhatsApp e (se quiser) já deixe um follow-up agendado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg border bg-background/60 p-3 text-sm whitespace-pre-wrap">
              {waText || "—"}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-background/60 p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">Follow-up automático</div>
                <div className="text-xs text-muted-foreground">
                  Cria uma tarefa pendente para amanhã e você não perde o timing.
                </div>
              </div>
              <Checkbox
                checked={waAutoFollowup}
                onCheckedChange={(v) => setWaAutoFollowup(Boolean(v))}
                aria-label="Agendar follow-up automático"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void copyTextToClipboard(waText)
                    .then(() => {
                      setCopied(true);
                      toast.success("Mensagem copiada.");
                      setTimeout(() => setCopied(false), 1500);
                    })
                    .catch(() => toast.error("Não foi possível copiar."));
                }}
                disabled={!waText}
              >
                {copied ? <CheckIcon className="mr-2 size-4" /> : <CopyIcon className="mr-2 size-4" />}
                {copied ? "Copiado" : "Copiar mensagem"}
              </Button>

              <Button
                asChild
                type="button"
                disabled={!whatsappLink}
                onClick={() => {
                  void maybeCreateFollowupTask();
                }}
              >
                <a href={whatsappLink ?? "#"} target="_blank" rel="noreferrer">
                  <MessageCircleIcon className="mr-2 size-4" />
                  Abrir no WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
}

