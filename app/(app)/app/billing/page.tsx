"use client";

import Link from "next/link";
import { CreditCardIcon, CrownIcon, SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBillingSummary } from "@/features/billing/hooks";

function pct(used: number, max: number) {
  if (!max) return 0;
  return Math.min(1, used / max);
}

export default function BillingPage() {
  const billing = useBillingSummary();

  const plan = billing.data?.plan;
  const usage = billing.data?.usage;

  const vehiclesUsed = usage?.vehicles ?? 0;
  const leadsUsed = usage?.leads ?? 0;

  const maxVehicles = plan?.max_vehicles ?? 0;
  const maxLeads = plan?.max_leads ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
          <p className="text-sm text-muted-foreground">
            Veja seu plano atual, limites e uso. (Preparado para cobrança futura.)
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/planos">
            <CreditCardIcon className="mr-2 size-4" />
            Ver planos
          </Link>
        </Button>
      </div>

      <Card className="rounded-xl bg-background/50 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Plano atual
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold tracking-tight">
                {billing.isLoading ? "—" : plan?.name ?? "Free"}
              </div>
              <Badge variant="secondary" className="border bg-background/60">
                {plan?.ai_enabled ? (
                  <>
                    <SparklesIcon className="mr-1 size-3" /> IA habilitada
                  </>
                ) : (
                  "IA desabilitada"
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {billing.isError
                ? "Não foi possível carregar os dados do plano."
                : "Limites e uso por empresa (tenant)."}
            </p>
          </div>

          <Button asChild className="sm:self-start">
            <Link href="/planos">
              <CrownIcon className="mr-2 size-4" />
              Upgrade para Pro
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Veículos</div>
              <div className="text-sm text-muted-foreground">
                {billing.isLoading ? "—" : `${vehiclesUsed} / ${maxVehicles}`}
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-emerald-500/70"
                style={{ width: `${Math.round(pct(vehiclesUsed, maxVehicles) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Limite de criação de veículos por plano.
            </div>
          </div>

          <div className="rounded-xl border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Leads</div>
              <div className="text-sm text-muted-foreground">
                {billing.isLoading ? "—" : `${leadsUsed} / ${maxLeads}`}
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-blue-500/60"
                style={{ width: `${Math.round(pct(leadsUsed, maxLeads) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Limite de criação de leads por plano.
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl bg-background/50 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-medium">O que acontece quando atingir o limite?</div>
        <p className="mt-1 text-sm text-muted-foreground">
          O cadastro de novos veículos/leads é bloqueado. Você pode fazer upgrade para o Pro a
          qualquer momento.
        </p>
      </Card>
    </div>
  );
}

