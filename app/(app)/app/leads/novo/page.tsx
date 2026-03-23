"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LeadForm } from "@/features/leads/lead-form";
import { useCreateLead } from "@/features/leads/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import type { LeadFormValues } from "@/features/leads/schema";
import { getHumanErrorMessage } from "@/lib/errors";
import { PageHeader } from "@/components/app/page-header";

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
      <PageHeader
        kicker="CRM"
        title="Novo lead"
        description="Registre o contato e mantenha o próximo passo claro."
      />

      <LeadForm
        title="Cadastro do lead"
        submitLabel="Criar lead"
        onSubmit={onSubmit}
        loading={profile.isLoading || create.isPending}
      />
    </div>
  );
}

