"use client";

import * as React from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";

import { useEvents, useCreateEvent, useDeleteEvent } from "@/features/events/hooks";
import { EventFormSchema, type EventFormValues } from "@/features/events/schema";
import { useLeads } from "@/features/leads/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AgendaPage() {
  const profile = useMyProfile();
  const leads = useLeads();
  const events = useEvents();
  const create = useCreateEvent();
  const del = useDeleteEvent();

  const [open, setOpen] = React.useState(false);

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

    await create.mutateAsync({
      values,
      companyId: profile.data.company_id,
      userId: profile.data.id,
    });

    toast.success("Evento criado.");
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Retornos, visitas e test-drives com contexto.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Novo evento
        </Button>
      </div>

      <Card className="bg-background/60 p-4">
        {events.isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : events.isError ? (
          <div className="text-sm text-destructive">
            Não foi possível carregar a agenda.
          </div>
        ) : events.data?.length ? (
          <div className="grid gap-3">
            {events.data.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-2 rounded-lg border bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div className="truncate font-medium">{e.title}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
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
            <div className="text-sm text-muted-foreground">
              Sem eventos por enquanto.
            </div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Criar primeiro evento
            </Button>
          </div>
        )}
      </Card>

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
                value={form.watch("lead_id") ?? ""}
                onValueChange={(v) => form.setValue("lead_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={leads.isLoading ? "Carregando..." : "Selecionar lead"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
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

