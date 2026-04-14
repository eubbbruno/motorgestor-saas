"use client";

import { useMemo } from "react";
import { BarChart3Icon, CarIcon, DownloadIcon, FileTextIcon, UsersIcon } from "lucide-react";
import Papa from "papaparse";

import { useVehicles } from "@/features/vehicles/hooks";
import { useLeads } from "@/features/leads/hooks";
import { Button } from "@/components/ui/button";
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

  function exportCSV() {
    const leadsData = (leads.data ?? []).map((l) => ({
      Nome: l.name,
      Telefone: l.phone ?? "",
      Email: l.email ?? "",
      Status: l.status,
      Origem: l.source ?? "",
      "Criado em": l.created_at ? new Date(l.created_at).toLocaleDateString("pt-BR") : "",
    }));
    const vehiclesData = (vehicles.data ?? []).map((v) => ({
      Título: v.title,
      Preço: v.price ?? "",
      Status: v.status ?? "",
      "Criado em": v.created_at ? new Date(v.created_at).toLocaleDateString("pt-BR") : "",
    }));

    const csvLeads = Papa.unparse(leadsData);
    const csvVehicles = Papa.unparse(vehiclesData);
    const blob = new Blob(
      [`LEADS\n${csvLeads}\n\nVEÍCULOS\n${csvVehicles}`],
      { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `motorgestor-relatorio-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Insights"
        title="Relatórios"
        description="Indicadores essenciais para acompanhar sua operação."
        right={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV} className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
              <DownloadIcon className="mr-2 size-4" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={exportPDF} className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
              <FileTextIcon className="mr-2 size-4" />
              Exportar PDF
            </Button>
          </div>
        }
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

