"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";

import { useVehicles, useDeleteVehicle } from "@/features/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { PageHeader } from "@/components/app/page-header";
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
import type { VehicleRow } from "@/types/models";

export default function VeiculosPage() {
  const vehicles = useVehicles();
  const del = useDeleteVehicle();

  const [toDelete, setToDelete] = React.useState<VehicleRow | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      toast.success("Veículo removido.");
      setToDelete(null);
    } catch {
      toast.error("Não foi possível remover o veículo.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Estoque"
        title="Veículos"
        description="Seu estoque organizado e fácil de consultar."
        right={
          <Button asChild className="w-full sm:w-auto">
            <Link href="/app/veiculos/novo">
              <PlusIcon className="mr-2 size-4" />
              Novo veículo
            </Link>
          </Button>
        }
      />

      <PremiumSurface>
        <div className="p-5 sm:p-6">
          {vehicles.isLoading ? (
            <div className="text-sm text-mg-fg-muted">Carregando...</div>
          ) : vehicles.isError ? (
            <div className="text-sm text-red-300">
              Não foi possível carregar veículos. Verifique sua configuração do Supabase.
            </div>
          ) : vehicles.data?.length ? (
            <>
              {/* Mobile list */}
              <div className="grid gap-3 md:hidden">
                {vehicles.data.map((v) => (
                  <Card
                    key={v.id}
                    className="rounded-2xl border-mg-border bg-mg-surface/60 p-4 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/app/veiculos/${v.id}`}
                          className="truncate text-sm font-semibold text-foreground hover:underline hover:underline-offset-4"
                        >
                          {v.title}
                        </Link>
                        <div className="mt-1 text-xs text-mg-fg-muted">
                          {v.make ?? "—"} · {v.model ?? "—"}
                        </div>
                        <div className="mt-1 text-xs text-mg-fg-muted">
                          {v.year ? `${v.year} · ` : ""}
                          {String(v.status)}
                          {typeof v.price === "number"
                            ? ` · ${v.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
                            : ""}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Ações">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/app/veiculos/${v.id}`}>Abrir</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setToDelete(v)}>
                            <TrashIcon className="mr-2 size-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Ano</TableHead>
                      <TableHead className="hidden md:table-cell">Preço</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.data.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>
                          <Link
                            href={`/app/veiculos/${v.id}`}
                            className="font-medium hover:underline hover:underline-offset-4"
                          >
                            {v.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {v.make ?? "—"} · {v.model ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{v.status}</TableCell>
                        <TableCell className="hidden md:table-cell">{v.year ?? "—"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {typeof v.price === "number"
                            ? v.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Ações">
                                <MoreHorizontalIcon className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/app/veiculos/${v.id}`}>Abrir</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setToDelete(v)}
                              >
                                <TrashIcon className="mr-2 size-4" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-mg-fg-muted">
                Nenhum veículo cadastrado ainda.
              </div>
              <Button asChild variant="outline" className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
                <Link href="/app/veiculos/novo">Cadastrar o primeiro</Link>
              </Button>
            </div>
          )}
        </div>
      </PremiumSurface>

      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover veículo</DialogTitle>
            <DialogDescription>
              Isso remove o veículo do seu estoque. Você pode cadastrar novamente depois.
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

