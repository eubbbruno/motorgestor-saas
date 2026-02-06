"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { LeadForm } from "@/features/leads/lead-form";
import type { LeadFormValues } from "@/features/leads/schema";
import { useLead, useUpdateLead, useDeleteLead } from "@/features/leads/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LeadDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const lead = useLead(id);
  const update = useUpdateLead();
  const del = useDeleteLead();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  async function onSubmit(values: LeadFormValues) {
    const l = await update.mutateAsync({ id, values });
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
        <LeadForm
          title="Detalhes do lead"
          submitLabel="Salvar alterações"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          loading={update.isPending}
        />
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

