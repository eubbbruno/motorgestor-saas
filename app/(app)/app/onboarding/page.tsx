"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRightIcon,
  BuildingIcon,
  CarIcon,
  CheckIcon,
  Loader2Icon,
  PartyPopperIcon,
  UsersIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { getHumanErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Schema ───────────────────────────────────────────────────────────────────

const Schema = z.object({
  companyName: z.string().min(2, "Informe o nome da sua empresa."),
});

type FormValues = z.infer<typeof Schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Empresa", icon: BuildingIcon },
  { label: "Veículo", icon: CarIcon },
  { label: "Lead", icon: UsersIcon },
  { label: "Pronto!", icon: PartyPopperIcon },
] as const;

// ─── Input style ──────────────────────────────────────────────────────────────

const inputCls =
  "bg-[#0A1A0C] border-[rgba(74,229,74,0.2)] text-white placeholder:text-[#6B9E6B]/50 focus-visible:border-[#4AE54A] focus-visible:ring-[rgba(74,229,74,0.15)] rounded-xl h-11";

// ─── Slide transition helpers ─────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function slideInitial(direction: 1 | -1) {
  return { x: direction * 40, opacity: 0, filter: "blur(6px)" };
}
const slideAnimate = { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } };
function slideExit(direction: 1 | -1) {
  return { x: direction * -40, opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { companyName: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const [statusLoading, setStatusLoading] = React.useState(true);
  const [companyId, setCompanyId] = React.useState<string | null>(null);
  const [vehicles, setVehicles] = React.useState(0);
  const [leads, setLeads] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  const completed = vehicles > 0 && leads > 0;
  const companyName = form.watch("companyName");
  const suggestedSlug = companyName ? slugify(companyName) : "";

  // Derived step index
  const currentStep = !companyId ? 0 : vehicles === 0 ? 1 : leads === 0 ? 2 : 3;
  const progress = Math.round((currentStep / 3) * 100);

  // ── Status ────────────────────────────────────────────────────────────────

  async function refreshStatus() {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/onboarding/status", { method: "GET" });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; companyId: string | null; vehicles: number; leads: number; completed: boolean }
        | { ok: false; error: string };
      if (!res.ok || !body || body.ok === false)
        throw new Error(body && "error" in body ? body.error : "Falha.");
      setCompanyId(body.companyId);
      setVehicles(Number(body.vehicles ?? 0));
      setLeads(Number(body.leads ?? 0));
    } catch {
      // não bloqueia UI
    } finally {
      setStatusLoading(false);
    }
  }

  React.useEffect(() => {
    void refreshStatus();
  }, []);

  React.useEffect(() => {
    if (!statusLoading && completed) {
      router.replace("/app");
      router.refresh();
    }
  }, [completed, router, statusLoading]);

  // ── Submit ────────────────────────────────────────────────────────────────

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sessão inválida. Faça login novamente.");

      const res = await fetch("/api/onboarding/company", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.companyName,
          slug: suggestedSlug || slugify(values.companyName),
        }),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; companyId: string }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "Falha ao criar empresa.");
      }

      toast.success("Empresa configurada. Bora vender!");
      setDirection(1);
      await refreshStatus();
      router.push("/app/veiculos/novo");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível concluir o onboarding.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-8">
      {/* ── Page title ── */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Configure sua revenda
        </h1>
        <p className="text-sm text-[#6B9E6B]">
          Siga os passos abaixo para começar a operar em minutos.
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#6B9E6B]">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[rgba(74,229,74,0.08)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#4AE54A] shadow-[0_0_8px_rgba(74,229,74,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute inset-x-0 top-5 h-px bg-[rgba(74,229,74,0.1)]" />
        <div
          className="absolute top-5 left-0 h-px bg-[#4AE54A] transition-all duration-700 ease-out shadow-[0_0_6px_rgba(74,229,74,0.5)]"
          style={{ width: `${progress}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={[
                  "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-[#1a3d1a] border-[#4AE54A]"
                    : isActive
                      ? "bg-[#4AE54A] border-[#4AE54A] shadow-[0_0_16px_rgba(74,229,74,0.5)]"
                      : "bg-[#0F2014] border-[rgba(74,229,74,0.15)]",
                ].join(" ")}
              >
                {isCompleted ? (
                  <CheckIcon className="size-4 text-[#4AE54A]" />
                ) : (
                  <Icon
                    className={[
                      "size-4",
                      isActive ? "text-[#0D1F1A]" : "text-[#6B9E6B]",
                    ].join(" ")}
                  />
                )}
              </div>

              {/* Label — hidden on mobile as dots */}
              <span
                className={[
                  "hidden sm:block text-xs font-medium transition-colors",
                  isActive ? "text-[#4AE54A]" : isCompleted ? "text-[#6B9E6B]" : "text-[#6B9E6B]/50",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Step content ── */}
      {statusLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="size-6 animate-spin text-[#4AE54A]" />
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={slideInitial(direction)}
                animate={slideAnimate}
                exit={slideExit(direction)}
              >
                <StepCard
                  number={1}
                  title="Sua empresa"
                  description="Como a sua revenda se chama? Isso aparece nos documentos e comunicações."
                >
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    <fieldset disabled={loading} aria-busy={loading} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="companyName" className="text-[#6B9E6B] text-xs font-medium">
                          Nome da empresa
                        </Label>
                        <Input
                          id="companyName"
                          placeholder="Ex: Revenda Central"
                          autoComplete="organization"
                          aria-invalid={Boolean(form.formState.errors.companyName)}
                          aria-describedby={
                            form.formState.errors.companyName ? "companyName-error" : undefined
                          }
                          className={inputCls}
                          {...form.register("companyName")}
                        />
                        {suggestedSlug ? (
                          <p className="text-xs text-[#6B9E6B]/70">
                            Identificador:{" "}
                            <span className="font-mono text-[#4AE54A]/80">{suggestedSlug}</span>
                          </p>
                        ) : null}
                        {form.formState.errors.companyName ? (
                          <p id="companyName-error" className="text-xs text-red-400" role="alert">
                            {form.formState.errors.companyName.message}
                          </p>
                        ) : null}
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-semibold text-sm shadow-[0_0_20px_rgba(74,229,74,0.25)] transition-all hover:-translate-y-0.5"
                      >
                        {loading ? (
                          <>
                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            Criar empresa <ArrowRightIcon className="ml-2 size-4" />
                          </>
                        )}
                      </Button>
                    </fieldset>
                  </form>
                </StepCard>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={slideInitial(direction)}
                animate={slideAnimate}
                exit={slideExit(direction)}
              >
                <StepCard
                  number={2}
                  title="Primeiro veículo"
                  description="Adicione o primeiro veículo ao seu estoque. Você pode cadastrar quantos quiser depois."
                >
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/app/veiculos/novo"
                      className="flex items-center justify-between w-full rounded-xl border border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.06)] px-5 py-4 text-sm font-semibold text-white hover:bg-[rgba(74,229,74,0.12)] hover:border-[rgba(74,229,74,0.35)] transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-[rgba(74,229,74,0.12)] flex items-center justify-center">
                          <CarIcon className="size-4 text-[#4AE54A]" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-white">Cadastrar veículo</div>
                          <div className="text-xs text-[#6B9E6B]">Marca, modelo, ano, preço, fotos</div>
                        </div>
                      </div>
                      <ArrowRightIcon className="size-4 text-[#6B9E6B] group-hover:text-[#4AE54A] transition-colors" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => void refreshStatus()}
                      disabled={statusLoading}
                      className="w-full text-xs text-[#6B9E6B] hover:text-white transition-colors py-2"
                    >
                      {statusLoading ? "Verificando..." : "↻ Já cadastrei, atualizar progresso"}
                    </button>
                  </div>
                </StepCard>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={slideInitial(direction)}
                animate={slideAnimate}
                exit={slideExit(direction)}
              >
                <StepCard
                  number={3}
                  title="Primeiro lead"
                  description="Registre o primeiro cliente interessado. O CRM e pipeline ficam disponíveis assim que você criar."
                >
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/app/leads/novo"
                      className="flex items-center justify-between w-full rounded-xl border border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.06)] px-5 py-4 text-sm font-semibold text-white hover:bg-[rgba(74,229,74,0.12)] hover:border-[rgba(74,229,74,0.35)] transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-[rgba(74,229,74,0.12)] flex items-center justify-center">
                          <UsersIcon className="size-4 text-[#4AE54A]" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-white">Criar lead</div>
                          <div className="text-xs text-[#6B9E6B]">Nome, contato, interesse</div>
                        </div>
                      </div>
                      <ArrowRightIcon className="size-4 text-[#6B9E6B] group-hover:text-[#4AE54A] transition-colors" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => void refreshStatus()}
                      disabled={statusLoading}
                      className="w-full text-xs text-[#6B9E6B] hover:text-white transition-colors py-2"
                    >
                      {statusLoading ? "Verificando..." : "↻ Já cadastrei, atualizar progresso"}
                    </button>
                  </div>
                </StepCard>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={slideInitial(direction)}
                animate={slideAnimate}
                exit={slideExit(direction)}
              >
                <StepCard
                  number={4}
                  title="Tudo pronto! 🎉"
                  description="Sua revenda está configurada. O dashboard completo está disponível agora."
                >
                  <div className="mt-5 space-y-4">
                    <div className="rounded-xl border border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.06)] p-5 text-center">
                      <PartyPopperIcon className="size-8 text-[#4AE54A] mx-auto mb-2" />
                      <div className="text-sm font-semibold text-white mb-1">
                        {vehicles} veículo{vehicles !== 1 ? "s" : ""} · {leads} lead
                        {leads !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-[#6B9E6B]">
                        Continue adicionando estoque e leads para maximizar suas vendas.
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        router.replace("/app");
                        router.refresh();
                      }}
                      className="w-full h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-semibold text-sm shadow-[0_0_20px_rgba(74,229,74,0.25)] transition-all hover:-translate-y-0.5"
                    >
                      Ir para o dashboard <ArrowRightIcon className="ml-2 size-4" />
                    </Button>
                  </div>
                </StepCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Status hint ── */}
      {!statusLoading && currentStep > 0 && currentStep < 3 && (
        <p className="text-center text-xs text-[#6B9E6B]/60">
          Veículos: {vehicles} · Leads: {leads}
        </p>
      )}
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] shadow-[0_0_30px_rgba(74,229,74,0.06)] p-6 sm:p-8">
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.35)] to-transparent" />

      <div className="flex items-center gap-3 mb-2">
        <div className="size-7 rounded-lg bg-[rgba(74,229,74,0.12)] flex items-center justify-center">
          <span className="text-xs font-bold text-[#4AE54A]">{number}</span>
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <p className="text-sm text-[#6B9E6B] leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
