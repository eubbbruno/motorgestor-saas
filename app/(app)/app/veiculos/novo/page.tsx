"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { VehicleForm } from "@/features/vehicles/vehicle-form";
import { useCreateVehicle } from "@/features/vehicles/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import type { VehicleFormValues } from "@/features/vehicles/schema";
import { getHumanErrorMessage } from "@/lib/errors";

export default function NovoVeiculoPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const create = useCreateVehicle();

  async function onSubmit(values: VehicleFormValues) {
    if (!profile.data?.company_id) {
      toast.error("Sua empresa ainda não está configurada.");
      router.push("/app/onboarding");
      return;
    }

    try {
      const v = await create.mutateAsync({
        values,
        companyId: profile.data.company_id,
        userId: profile.data.id,
      });

      toast.success("Veículo cadastrado.");
      router.push(`/app/veiculos/${v.id}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível cadastrar o veículo.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Novo veículo</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre seu veículo com as informações essenciais para atendimento e
          negociação.
        </p>
      </div>

      <VehicleForm
        title="Cadastro do veículo"
        submitLabel="Cadastrar veículo"
        onSubmit={onSubmit}
        loading={profile.isLoading || create.isPending}
      />
    </div>
  );
}

