"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LeadForm } from "@/features/leads/lead-form";
import { useCreateLead } from "@/features/leads/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import type { LeadFormValues } from "@/features/leads/schema";
import { getHumanErrorMessage } from "@/lib/errors";

export default function NovoLeadPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const create = useCreateLead();

  async function onSubmit(values: LeadFormValues) {
    if (!profile.data?.company_id) {
      toast.error("Sua empresa ainda não está configurada.");
      router.push("/app/onboarding");
      return;
    }

    try {
      const l = await create.mutateAsync({
        values,
        companyId: profile.data.company_id,
        userId: profile.data.id,
      });

      toast.success("Lead criado.");
      router.push(`/app/leads/${l.id}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível criar o lead.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Novo lead</h1>
        <p className="text-sm text-muted-foreground">
          Registre o contato e mantenha o próximo passo claro.
        </p>
      </div>

      <LeadForm
        title="Cadastro do lead"
        submitLabel="Criar lead"
        onSubmit={onSubmit}
        loading={profile.isLoading || create.isPending}
      />
    </div>
  );
}

