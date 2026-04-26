"use client";

import { useState } from "react";
import {
  CheckIcon,
  CreditCardIcon,
  CrownIcon,
  SparklesIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBillingSummary } from "@/features/billing/hooks";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { CheckoutBrick } from "@/components/billing/checkout-brick";
import { PLANS, type PlanId } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";
import { useMyProfile } from "@/features/auth/hooks";

function pct(used: number, max: number) {
  if (!max) return 0;
  return Math.min(1, used / max);
}

export default function BillingPage() {
  const billing = useBillingSummary();
  const profile = useMyProfile();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [preferenceError, setPreferenceError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const plan = billing.data?.plan;
  const usage = billing.data?.usage;
  const vehiclesUsed = usage?.vehicles ?? 0;
  const leadsUsed = usage?.leads ?? 0;
  const maxVehicles = plan?.max_vehicles ?? 0;
  const maxLeads = plan?.max_leads ?? 0;

  async function handleSelectPlan(planId: PlanId) {
    setLoadingPlan(planId);
    setPreferenceError(null);
    setPreferenceId(null);
    setSelectedPlan(null);
    try {
      const res = await fetch("/api/billing/create-preference", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          userEmail: profile.data?.email ?? "",
          userId: profile.data?.company_id ?? "",
        }),
      });
      const data = await res.json();
      if (data.preferenceId) {
        setSelectedPlan(planId);
        setPreferenceId(data.preferenceId);
      } else {
        const msg = data.error ?? "preferenceId ausente na resposta da API.";
        console.error("[Billing] create-preference falhou:", data);
        setPreferenceError(msg);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Billing] erro ao criar preferência:", err);
      setPreferenceError(`Erro de rede: ${msg}`);
    } finally {
      setLoadingPlan(null);
    }
  }

  const planOrder: PlanId[] = ["starter", "pro", "enterprise"];
  const highlightedPlan: PlanId = "pro";

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Billing"
        title="Plano & Cobrança"
        description="Escolha o plano ideal para sua concessionária."
        right={
          <div className="flex items-center gap-1 rounded-xl border border-[rgba(74,229,74,0.15)] bg-[#0A1A0C] p-1">
            {(["monthly", "annual"] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => {
                  setBillingCycle(cycle);
                  setPreferenceId(null);
                  setSelectedPlan(null);
                }}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                  billingCycle === cycle
                    ? "bg-[#4AE54A] text-[#0A1A0C]"
                    : "text-[#6B9E6B] hover:text-white"
                )}
              >
                {cycle === "monthly" ? "Mensal" : "Anual"}
                {cycle === "annual" && (
                  <span className="ml-1.5 text-xs opacity-70">-20%</span>
                )}
              </button>
            ))}
          </div>
        }
      />

      {/* Current plan usage */}
      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-wider text-mg-fg-muted">
                Plano atual
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold tracking-tight">
                  {billing.isLoading ? "—" : plan?.name ?? "Free"}
                </div>
                <Badge
                  variant="secondary"
                  className="border-mg-border bg-mg-surface text-foreground"
                >
                  {plan?.ai_enabled ? (
                    <>
                      <SparklesIcon className="mr-1 size-3" /> IA habilitada
                    </>
                  ) : (
                    "IA desabilitada"
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-mg-border bg-mg-surface/55 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Veículos</div>
                <div className="text-sm text-mg-fg-muted">
                  {billing.isLoading ? "—" : `${vehiclesUsed} / ${maxVehicles}`}
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-black/30">
                <div
                  className="h-2 rounded-full bg-emerald-500/70"
                  style={{
                    width: `${Math.round(pct(vehiclesUsed, maxVehicles) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-mg-border bg-mg-surface/55 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Leads</div>
                <div className="text-sm text-mg-fg-muted">
                  {billing.isLoading ? "—" : `${leadsUsed} / ${maxLeads}`}
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-black/30">
                <div
                  className="h-2 rounded-full bg-blue-500/60"
                  style={{
                    width: `${Math.round(pct(leadsUsed, maxLeads) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </PremiumSurface>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {planOrder.map((planId) => {
          const p = PLANS[planId];
          const price =
            billingCycle === "annual" ? p.priceAnnual : p.priceMonthly;
          const isHighlighted = planId === highlightedPlan;
          const isSelected = selectedPlan === planId;
          const isLoading = loadingPlan === planId;

          return (
            <div
              key={planId}
              className={cn(
                "relative rounded-2xl border p-6 transition-colors",
                isHighlighted
                  ? "border-[#4AE54A] bg-[#0A1A0C]"
                  : "border-[rgba(74,229,74,0.15)] bg-[#0A1A0C]",
                isSelected && "ring-2 ring-[#4AE54A]"
              )}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#4AE54A] px-3 py-0.5 text-xs font-semibold text-[#0A1A0C]">
                    Mais popular
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CrownIcon className="size-4 text-[#4AE54A]" />
                  <span className="font-semibold text-white">{p.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    R${price}
                  </span>
                  <span className="text-sm text-[#6B9E6B]">/mês</span>
                </div>
                {billingCycle === "annual" && (
                  <div className="text-xs text-[#4AE54A]">
                    Cobrado anualmente (R${price * 12}/ano)
                  </div>
                )}
              </div>

              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-[#4AE54A]" />
                    <span className="text-[#6B9E6B]">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-6 w-full",
                  isHighlighted
                    ? "bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]"
                    : "border-[rgba(74,229,74,0.3)] bg-transparent text-white hover:bg-[rgba(74,229,74,0.08)]"
                )}
                variant={isHighlighted ? "default" : "outline"}
                disabled={isLoading}
                onClick={() => handleSelectPlan(planId)}
              >
                <CreditCardIcon className="mr-2 size-4" />
                {isLoading ? "Aguarde..." : "Assinar"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Erro ao criar preferência */}
      {preferenceError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="flex items-center gap-2 font-medium">
            Erro ao iniciar pagamento
          </div>
          <p className="mt-1 font-mono text-xs text-red-400/70">{preferenceError}</p>
          <p className="mt-2 text-red-400/70">Verifique se o Mercado Pago está configurado corretamente no Vercel (MP_ACCESS_TOKEN).</p>
        </div>
      )}

      {/* Checkout Brick */}
      {preferenceId && selectedPlan && (
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
            <div className="mb-4 flex items-center gap-2">
              <CreditCardIcon className="size-5 text-[#4AE54A]" />
              <span className="font-semibold text-white">
                Pagamento — {PLANS[selectedPlan].name}
              </span>
            </div>
            <CheckoutBrick
              preferenceId={preferenceId}
              amount={billingCycle === "annual" ? PLANS[selectedPlan].priceAnnual : PLANS[selectedPlan].priceMonthly}
            />
          </Card>
        </PremiumSurface>
      )}

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <div className="text-sm font-medium text-foreground">
            O que acontece quando atingir o limite?
          </div>
          <p className="mt-1 text-sm text-mg-fg-muted">
            O cadastro de novos veículos/leads é bloqueado. Você pode fazer
            upgrade a qualquer momento.
          </p>
        </Card>
      </PremiumSurface>
    </div>
  );
}
