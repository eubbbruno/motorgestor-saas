"use client";

import Link from "next/link";
import { ArrowRightIcon, CalendarIcon, CarIcon, UsersIcon } from "lucide-react";
import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVehicles } from "@/features/vehicles/hooks";
import { useLeads } from "@/features/leads/hooks";
import { useEvents } from "@/features/events/hooks";

export default function AppDashboardPage() {
  const vehicles = useVehicles();
  const leads = useLeads();
  const events = useEvents();

  const vehicleCount = vehicles.data?.length ?? 0;

  const activeLeads = useMemo(() => {
    const list = leads.data ?? [];
    return list.filter((l) => l.status !== "ganho" && l.status !== "perdido").length;
  }, [leads.data]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    const list = events.data ?? [];
    return list.filter((e) => new Date(e.start_at).getTime() >= now).length;
  }, [events.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão rápida do dia: estoque, leads e próximos compromissos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/leads/novo">Novo lead</Link>
          </Button>
          <Button asChild>
            <Link href="/app/veiculos/novo">
              Novo veículo <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Veículos</div>
            <CarIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {vehicles.isLoading ? "—" : vehicleCount}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Cadastre seu estoque para acelerar o atendimento.
          </div>
        </Card>
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Leads ativos</div>
            <UsersIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {leads.isLoading ? "—" : activeLeads}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Acompanhe o funil e evite leads “esfriando”.
          </div>
        </Card>
        <Card className="bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Agenda</div>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {events.isLoading ? "—" : upcoming}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Agende retornos e test-drives com contexto.
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-background/60 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-base font-medium">Primeiros passos</div>
                <Badge variant="secondary">MVP</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure o básico e comece a operar.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>1) Cadastre 5 veículos do seu estoque</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/veiculos/novo">Cadastrar</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>2) Registre os leads que já estão no WhatsApp</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/leads/novo">Registrar</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <span>3) Marque retornos na agenda</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/agenda">Abrir</Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-background/60 p-6">
          <div className="space-y-1">
            <div className="text-base font-medium">Boas práticas</div>
            <p className="text-sm text-muted-foreground">
              O que as revendas que mais vendem fazem todo dia.
            </p>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Lead respondido em até 5 minutos tem muito mais chance de virar venda.</li>
            <li>Tenha um “próximo passo” claro para cada lead (visita, proposta, retorno).</li>
            <li>Padronize status: facilita relatórios e previsibilidade.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

