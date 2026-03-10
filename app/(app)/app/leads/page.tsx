"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { MessageCircleIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";

import { useLeads, useDeleteLead } from "@/features/leads/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LeadRow } from "@/types/models";
import { buildLeadWhatsAppText, buildWhatsAppLink } from "@/lib/whatsapp";

export default function LeadsPage() {
  const leads = useLeads();
  const vehicles = useVehicles();
  const del = useDeleteLead();

  const [toDelete, setToDelete] = React.useState<LeadRow | null>(null);

  const vehicleById = React.useMemo(() => {
    const map = new Map<string, { title: string }>();
    (vehicles.data ?? []).forEach((v) => map.set(v.id, { title: v.title }));
    return map;
  }, [vehicles.data]);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      toast.success("Lead removido.");
      setToDelete(null);
    } catch {
      toast.error("Não foi possível remover o lead.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe seu funil e tenha próximos passos claros.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/leads/novo">
            <PlusIcon className="mr-2 size-4" />
            Novo lead
          </Link>
        </Button>
      </div>

      <Card className="bg-background/60">
        <div className="p-4">
          {leads.isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : leads.isError ? (
            <div className="text-sm text-destructive">
              Não foi possível carregar leads. Verifique sua configuração do Supabase.
            </div>
          ) : leads.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Origem</TableHead>
                  <TableHead className="w-20 text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.data.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Link
                        href={`/app/leads/${l.id}`}
                        className="font-medium hover:underline hover:underline-offset-4"
                      >
                        {l.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {l.phone ?? "—"} · {l.email ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{l.status}</TableCell>
                    <TableCell className="hidden md:table-cell">{l.source ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(() => {
                          const v = l.vehicle_id ? vehicleById.get(l.vehicle_id) : null;
                          const link = buildWhatsAppLink({
                            phone: l.phone,
                            text: buildLeadWhatsAppText({ leadName: l.name, vehicleTitle: v?.title ?? null }),
                          });
                          return link ? (
                            <Button asChild variant="ghost" size="icon" aria-label="Conversar no WhatsApp">
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <MessageCircleIcon className="size-4" />
                              </a>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" disabled aria-label="WhatsApp indisponível">
                              <MessageCircleIcon className="size-4" />
                            </Button>
                          );
                        })()}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Ações">
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/app/leads/${l.id}`}>Abrir</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setToDelete(l)}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Nenhum lead ainda.</div>
              <Button asChild variant="outline">
                <Link href="/app/leads/novo">Registrar o primeiro</Link>
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover lead</DialogTitle>
            <DialogDescription>
              Isso remove o lead do seu funil. Você pode registrar novamente depois.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={del.isPending}>
              {del.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

