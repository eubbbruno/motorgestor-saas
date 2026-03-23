"use client";

import { useMemo } from "react";
import { BarChart3Icon, CarIcon, UsersIcon } from "lucide-react";

import { useVehicles } from "@/features/vehicles/hooks";
import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

export default function RelatoriosPage() {
  const vehicles = useVehicles();
  const leads = useLeads();

  const conv = useMemo(() => {
    const total = (leads.data ?? []).length;
    const fechado = (leads.data ?? []).filter((l) => l.status === "fechado" || l.status === "ganho").length;
    const pct = total ? Math.round((fechado / total) * 100) : 0;
    return { total, fechado, pct };
  }, [leads.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Insights"
        title="Relatórios"
        description="Indicadores essenciais para acompanhar sua operação."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Estoque</div>
            <CarIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {vehicles.isLoading ? "—" : vehicles.data?.length ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Veículos cadastrados.</div>
          </Card>
        </PremiumSurface>
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Leads</div>
            <UsersIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {leads.isLoading ? "—" : leads.data?.length ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Total registrados.</div>
          </Card>
        </PremiumSurface>
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Conversão</div>
            <BarChart3Icon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{conv.pct}%</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {conv.fechado} fechados de {conv.total} leads.
          </div>
          </Card>
        </PremiumSurface>
      </div>

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="text-base font-medium">Interpretação rápida</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Se há muitos “novos”, foque em velocidade de resposta.</li>
          <li>Se a conversão é baixa, revise proposta e agenda de follow-up.</li>
          <li>Estoque parado pede ajuste de preço/descrição e reativação de leads.</li>
        </ul>
        </Card>
      </PremiumSurface>
    </div>
  );
}

