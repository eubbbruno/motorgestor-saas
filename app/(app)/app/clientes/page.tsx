"use client";

import { useMemo } from "react";
import { UsersIcon } from "lucide-react";

import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

export default function ClientesPage() {
  const leads = useLeads();

  const clientes = useMemo(
    () => (leads.data ?? []).filter((l) => l.status === "ganho"),
    [leads.data],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="CRM"
        title="Clientes"
        description="No MVP, clientes são leads marcados como ganho."
      />

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        {leads.isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : clientes.length ? (
          <div className="grid gap-3">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-mg-border bg-mg-surface/55 px-4 py-3 backdrop-blur"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.phone ?? "—"} · {c.email ?? "—"}
                  </div>
                </div>
                <UsersIcon className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Nenhum cliente ainda. Quando um lead virar venda, marque como “ganho”.
          </div>
        )}
        </Card>
      </PremiumSurface>
    </div>
  );
}

