"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { VehicleForm } from "@/features/vehicles/vehicle-form";
import { useCreateVehicle } from "@/features/vehicles/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import type { VehicleFormValues } from "@/features/vehicles/schema";
import { getHumanErrorMessage } from "@/lib/errors";
import { PageHeader } from "@/components/app/page-header";

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
      <PageHeader
        kicker="Estoque"
        title="Novo veículo"
        description="Cadastre o veículo com as informações essenciais para atendimento e negociação."
      />

      <VehicleForm
        title="Cadastro do veículo"
        submitLabel="Cadastrar veículo"
        onSubmit={onSubmit}
        companyId={profile.data?.company_id ?? null}
        loading={profile.isLoading || create.isPending}
      />
    </div>
  );
}

