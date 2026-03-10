"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Loader2Icon, MessageSquareTextIcon, PhoneCallIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";

import { LeadForm } from "@/features/leads/lead-form";
import type { LeadFormValues } from "@/features/leads/schema";
import { useLead, useUpdateLead, useDeleteLead } from "@/features/leads/hooks";
import { useCreateLeadEvent, useLeadEvents } from "@/features/leads/events-hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventType = "created" | "note" | "status_change" | "call" | "visit" | "sale";

const eventLabels: Record<EventType, string> = {
  created: "Criado",
  note: "Comentário",
  status_change: "Mudança de status",
  call: "Ligação",
  visit: "Visita",
  sale: "Venda",
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
  const update = useUpdateLead();
  const del = useDeleteLead();
  const events = useLeadEvents(id);
  const createEvent = useCreateLeadEvent();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Lead</h1>
          <p className="text-sm text-muted-foreground">
            Atualize status, notas e mantenha histórico do atendimento.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/leads">Voltar</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/app/proposta?leadId=${id}`}>Gerar proposta PDF</Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <TrashIcon className="mr-2 size-4" />
            Remover
          </Button>
        </div>
      </div>

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

          <Card className="bg-background/60 p-6">
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
                          {eventLabels[(e.type as EventType) ?? "note"] ?? e.type}
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
    </div>
  );
}

