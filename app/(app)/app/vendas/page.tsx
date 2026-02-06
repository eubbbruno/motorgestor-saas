"use client";

import { useMemo } from "react";
import { BarChart3Icon } from "lucide-react";

import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";

const order = ["novo", "contato", "visita", "proposta", "ganho", "perdido"] as const;

export default function VendasPage() {
  const leads = useLeads();

  const summary = useMemo(() => {
    const map = new Map<string, number>();
    order.forEach((s) => map.set(s, 0));
    (leads.data ?? []).forEach((l) => map.set(l.status, (map.get(l.status) ?? 0) + 1));
    return order.map((s) => ({ status: s, count: map.get(s) ?? 0 }));
  }, [leads.data]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Vendas</h1>
        <p className="text-sm text-muted-foreground">
          Visão do funil por etapa (baseado no status dos leads).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((s) => (
          <Card key={s.status} className="bg-background/60 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm capitalize text-muted-foreground">{s.status}</div>
              <BarChart3Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{s.count}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Leads nessa etapa.
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-background/60 p-6">
        <div className="text-base font-medium">Como usar</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>“Novo” deve ser limpo todo dia (resposta rápida aumenta conversão).</li>
          <li>“Proposta” precisa de prazo e retorno agendado.</li>
          <li>Analise “Perdido” para ajustar preço, abordagem e canais.</li>
        </ul>
      </Card>
    </div>
  );
}

