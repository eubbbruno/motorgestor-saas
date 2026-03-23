"use client";

import { useMemo } from "react";
import { BarChart3Icon } from "lucide-react";

import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

const order = ["novo", "contato", "proposta", "negociacao", "fechado", "perdido"] as const;

export default function VendasPage() {
  const leads = useLeads();

  const summary = useMemo(() => {
    const map = new Map<string, number>();
    order.forEach((s) => map.set(s, 0));
    (leads.data ?? []).forEach((l) => {
      const s =
        l.status === "visita"
          ? "negociacao"
          : l.status === "ganho"
            ? "fechado"
            : l.status;
      map.set(s, (map.get(s) ?? 0) + 1);
    });
    return order.map((s) => ({ status: s, count: map.get(s) ?? 0 }));
  }, [leads.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Funil"
        title="Vendas"
        description="Visão do funil por etapa (baseado no status dos leads)."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((s) => (
          <PremiumSurface key={s.status}>
            <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none">
            <div className="flex items-center justify-between">
              <div className="text-sm capitalize text-muted-foreground">{s.status}</div>
              <BarChart3Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{s.count}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Leads nessa etapa.
            </div>
            </Card>
          </PremiumSurface>
        ))}
      </div>

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="text-base font-medium">Como usar</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>“Novo” deve ser limpo todo dia (resposta rápida aumenta conversão).</li>
          <li>“Proposta” precisa de prazo e retorno agendado.</li>
          <li>Analise “Perdido” para ajustar preço, abordagem e canais.</li>
        </ul>
        </Card>
      </PremiumSurface>
    </div>
  );
}

