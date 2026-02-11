"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { useVehicle, useUpdateVehicle, useDeleteVehicle } from "@/features/vehicles/hooks";
import { VehicleForm } from "@/features/vehicles/vehicle-form";
import type { VehicleFormValues } from "@/features/vehicles/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VehicleDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const vehicle = useVehicle(id);
  const update = useUpdateVehicle();
  const del = useDeleteVehicle();

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  async function onSubmit(values: VehicleFormValues) {
    const v = await update.mutateAsync({ id, values });
    toast.success("Veículo atualizado.");
    router.push(`/app/veiculos/${v.id}`);
    router.refresh();
  }

  async function onDelete() {
    try {
      await del.mutateAsync(id);
      toast.success("Veículo removido.");
      router.push("/app/veiculos");
      router.refresh();
    } catch {
      toast.error("Não foi possível remover o veículo.");
    } finally {
      setConfirmOpen(false);
    }
  }

  const defaultValues: Partial<VehicleFormValues> | undefined = vehicle.data
    ? {
        title: vehicle.data.title,
        make: vehicle.data.make ?? "",
        model: vehicle.data.model ?? "",
        year: vehicle.data.year ?? undefined,
        price: vehicle.data.price ?? undefined,
        fipe_value: vehicle.data.fipe_value ?? undefined,
        fipe_reference: vehicle.data.fipe_reference ?? "",
        fipe_code: vehicle.data.fipe_code ?? "",
        mileage: vehicle.data.mileage ?? undefined,
        fuel: vehicle.data.fuel ?? "",
        transmission: vehicle.data.transmission ?? "",
        color: vehicle.data.color ?? "",
        status: vehicle.data.status,
        notes: vehicle.data.notes ?? "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Veículo</h1>
          <p className="text-sm text-muted-foreground">
            Edite as informações e mantenha o status do estoque atualizado.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/veiculos">Voltar</Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <TrashIcon className="mr-2 size-4" />
            Remover
          </Button>
        </div>
      </div>

      {vehicle.isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando...</div>
      ) : vehicle.isError ? (
        <div className="text-sm text-destructive">
          Não foi possível carregar o veículo.
        </div>
      ) : vehicle.data ? (
        <VehicleForm
          title="Detalhes do veículo"
          submitLabel="Salvar alterações"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          loading={update.isPending}
        />
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover veículo</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O veículo será removido do seu estoque.
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

