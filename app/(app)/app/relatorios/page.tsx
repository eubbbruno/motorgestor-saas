"use client";

import { useMemo } from "react";
import { BarChart3Icon, CarIcon, UsersIcon } from "lucide-react";

import { useVehicles } from "@/features/vehicles/hooks";
import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";

export default function RelatoriosPage() {
  const vehicles = useVehicles();
  const leads = useLeads();

  const conv = useMemo(() => {
    const total = (leads.data ?? []).length;
    const ganho = (leads.data ?? []).filter((l) => l.status === "ganho").length;
    const pct = total ? Math.round((ganho / total) * 100) : 0;
    return { total, ganho, pct };
  }, [leads.data]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Indicadores essenciais para acompanhar sua operação.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Estoque</div>
            <CarIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {vehicles.isLoading ? "—" : vehicles.data?.length ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Veículos cadastrados.</div>
        </Card>
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Leads</div>
            <UsersIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {leads.isLoading ? "—" : leads.data?.length ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Total registrados.</div>
        </Card>
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Conversão</div>
            <BarChart3Icon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{conv.pct}%</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {conv.ganho} ganhos de {conv.total} leads.
          </div>
        </Card>
      </div>

      <Card className="bg-background/60 p-6">
        <div className="text-base font-medium">Interpretação rápida</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Se há muitos “novos”, foque em velocidade de resposta.</li>
          <li>Se a conversão é baixa, revise proposta e agenda de follow-up.</li>
          <li>Estoque parado pede ajuste de preço/descrição e reativação de leads.</li>
        </ul>
      </Card>
    </div>
  );
}

