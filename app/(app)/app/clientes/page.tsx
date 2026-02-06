"use client";

import { useMemo } from "react";
import { UsersIcon } from "lucide-react";

import { useLeads } from "@/features/leads/hooks";
import { Card } from "@/components/ui/card";

export default function ClientesPage() {
  const leads = useLeads();

  const clientes = useMemo(
    () => (leads.data ?? []).filter((l) => l.status === "ganho"),
    [leads.data],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          No MVP, “clientes” são leads marcados como <span className="font-medium">ganho</span>.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        {leads.isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : clientes.length ? (
          <div className="grid gap-3">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-4 py-3"
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
    </div>
  );
}

