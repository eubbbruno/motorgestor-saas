"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  Building2Icon,
  CheckCircle2Icon,
  LayoutGridIcon,
  CarIcon,
  UsersIcon,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type OnboardingStatus =
  | { ok: true; companyId: string | null; vehicles: number; leads: number; completed: boolean }
  | { ok: false; error: string };

const DISMISSED_KEY = "mg:onboarding:dismissed:v1";
const PIPELINE_SEEN_KEY = "mg:onboarding:pipeline-seen:v1";

function safeGetLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function GuidedOnboardingModal() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = React.useState(false);

  const pipelineSeen = mounted ? safeGetLocalStorage(PIPELINE_SEEN_KEY) === "1" : false;

  const statusKey =
    status && status.ok
      ? `${status.companyId ?? "no-company"}|${status.vehicles}|${status.leads}|${pipelineSeen ? 1 : 0}`
      : "";

  const dismissedKey = mounted ? safeGetLocalStorage(DISMISSED_KEY) : null;

  const companyCreated = Boolean(status && status.ok && status.companyId);
  const hasVehicle = Boolean(status && status.ok && status.vehicles > 0);
  const hasLead = Boolean(status && status.ok && status.leads > 0);

  const showOnDashboardOnly = pathname === "/app";
  const shouldAutoShow =
    mounted &&
    showOnDashboardOnly &&
    companyCreated &&
    (!hasVehicle || !hasLead || !pipelineSeen) &&
    dismissedKey !== statusKey;

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/status", { method: "GET" });
      const body = (await res.json().catch(() => null)) as OnboardingStatus | null;
      if (!res.ok || !body) throw new Error("Falha ao carregar onboarding.");
      setStatus(body);
    } catch {
      // não bloqueia o app
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    void refresh();
  }, [mounted, refresh]);

  React.useEffect(() => {
    if (!mounted) return;
    if (shouldAutoShow) setOpen(true);
  }, [mounted, shouldAutoShow]);

  function dismiss() {
    if (status && status.ok) {
      const pipeline = safeGetLocalStorage(PIPELINE_SEEN_KEY) === "1";
      const key = `${status.companyId ?? "no-company"}|${status.vehicles}|${status.leads}|${pipeline ? 1 : 0}`;
      safeSetLocalStorage(DISMISSED_KEY, key);
    }
    setOpen(false);
  }

  function goto(href: string) {
    dismiss();
    router.push(href);
  }

  const steps = [
    {
      key: "company",
      title: "Empresa criada",
      description: "Deixa seus dados organizados e prontos para operar com segurança.",
      ok: companyCreated,
      href: "/app/onboarding",
      icon: Building2Icon,
    },
    {
      key: "vehicle",
      title: "Primeiro veículo",
      description: "Com 1 veículo no estoque, você já consegue responder leads com contexto.",
      ok: hasVehicle,
      href: "/app/veiculos/novo",
      icon: CarIcon,
    },
    {
      key: "lead",
      title: "Primeiro lead",
      description: "Centralize o atendimento e pare de perder lead no histórico do WhatsApp.",
      ok: hasLead,
      href: "/app/leads/novo",
      icon: UsersIcon,
    },
    {
      key: "pipeline",
      title: "Ver pipeline",
      description: "Você enxerga o funil e sabe exatamente o próximo passo.",
      ok: pipelineSeen,
      href: "/app/pipeline",
      icon: LayoutGridIcon,
    },
  ] as const;

  const completedCount = steps.filter((s) => s.ok).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  const nextStep =
    steps.find((s) => !s.ok && s.key !== "company") ?? steps.find((s) => !s.ok) ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) dismiss();
        else setOpen(true);
      }}
    >
      <DialogContent
        className="max-w-3xl rounded-2xl border-white/10 bg-black/70 p-0 shadow-[0_50px_140px_rgba(0,0,0,0.80)] backdrop-blur"
        showCloseButton
      >
        <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-b p-6 lg:border-b-0 lg:border-r">
            <DialogHeader>
              <DialogTitle>Bem-vindo ao MotorGestor</DialogTitle>
              <DialogDescription>
                Configure o básico em minutos e comece a vender com rotina (sem improviso).
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Progresso ({progressPct}%)
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {steps.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="flex items-start gap-3">
                      <div
                        className={
                          s.ok
                            ? "mt-0.5 flex size-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-500"
                            : "mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                        }
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{s.title}</span>
                          {s.ok ? (
                            <CheckCircle2Icon className="size-4 text-emerald-500" />
                          ) : null}
                        </div>
                        <div className="text-sm text-muted-foreground">{s.description}</div>
                        {s.ok ? (
                          <div className="mt-1 text-xs text-emerald-500/90">
                            Conquista: pronto.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {nextStep ? "Próxima ação" : "Tudo pronto"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {nextStep
                    ? `Você está a ${steps.filter((s) => !s.ok).length} passo(s) de operar redondo.`
                    : "Seu ambiente está configurado. Agora é execução: responder, mover funil e fazer follow-up."}
                </div>
              </div>
              <Button variant="outline" onClick={dismiss}>
                Agora não
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {nextStep ? (
                <Card className="rounded-xl bg-background/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-base font-semibold tracking-tight">{nextStep.title}</div>
                      <div className="text-sm text-muted-foreground">{nextStep.description}</div>
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <div className="font-medium text-foreground/90">O que você ganha agora</div>
                        {nextStep.key === "vehicle" ? (
                          <>
                            <div>• Responder leads com contexto (modelo/ano/valor).</div>
                            <div>• Padronizar cadastro e evitar retrabalho.</div>
                          </>
                        ) : nextStep.key === "lead" ? (
                          <>
                            <div>• Histórico do atendimento (sem perder conversa).</div>
                            <div>• Próximo passo claro com follow-ups.</div>
                          </>
                        ) : nextStep.key === "pipeline" ? (
                          <>
                            <div>• Você enxerga “quem está quente” e quem precisa de ação.</div>
                            <div>• Conversão melhora quando o funil anda todo dia.</div>
                          </>
                        ) : (
                          <>
                            <div>• Base pronta para trabalhar com organização.</div>
                            <div>• Permissões e dados separados por empresa.</div>
                          </>
                        )}
                        <div className="pt-2">Tempo estimado: 2–4 min.</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (nextStep.key === "pipeline") safeSetLocalStorage(PIPELINE_SEEN_KEY, "1");
                        goto(nextStep.href);
                      }}
                      disabled={loading}
                    >
                      Ir agora <ArrowRightIcon className="ml-2 size-4" />
                    </Button>
                  </div>
                </Card>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    safeSetLocalStorage(PIPELINE_SEEN_KEY, "1");
                    goto("/app/pipeline");
                  }}
                >
                  Abrir pipeline
                </Button>
                <Button asChild>
                  <Link href="/app/onboarding" onClick={dismiss}>
                    Ver onboarding completo <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                {loading
                  ? "Atualizando status..."
                  : status && status.ok
                    ? `Veículos: ${status.vehicles} · Leads: ${status.leads}`
                    : "Status indisponível no momento."}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

