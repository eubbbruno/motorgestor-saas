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
  CheckIcon,
  CreditCardIcon,
  LayoutGridIcon,
  Loader2Icon,
  PartyPopperIcon,
  ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { getHumanErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const CompanySchema = z.object({
  companyName: z.string().min(2, "Informe o nome da empresa."),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

type CompanyValues = z.infer<typeof CompanySchema>;

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

function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Empresa", icon: BuildingIcon },
  { label: "Plano", icon: CreditCardIcon },
  { label: "Integrações", icon: LayoutGridIcon },
  { label: "Pronto!", icon: PartyPopperIcon },
] as const;

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Grátis",
    period: "para sempre",
    features: ["Pipeline básico", "Até 50 veículos", "10 leads/mês", "Suporte por e-mail"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 79",
    period: "/mês",
    features: ["Pipeline ilimitado", "Veículos ilimitados", "Leads ilimitados", "FIPE integrada", "WhatsApp + templates", "Importação CSV"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    features: ["Tudo do Pro", "Multi-filial", "API dedicada", "Suporte prioritário", "Onboarding guiado"],
    highlighted: false,
  },
] as const;

type PlanId = typeof PLANS[number]["id"];

const INTEGRATIONS = [
  { id: "webmotors", name: "Webmotors", desc: "Publique anúncios direto no maior marketplace de carros do Brasil.", color: "#E8003D", available: true },
  { id: "olx", name: "OLX Autos", desc: "Sincronize estoque com a OLX e alcance milhões de compradores.", color: "#6E1FFF", available: true },
  { id: "icarros", name: "iCarros", desc: "Integração com o portal iCarros para anúncios automáticos.", color: "#0070F3", available: true },
  { id: "whatsapp", name: "WhatsApp", desc: "Templates de atendimento e histórico no perfil de cada lead.", color: "#25D366", available: false },
] as const;

type IntegrationId = typeof INTEGRATIONS[number]["id"];

const inputCls =
  "bg-[#0A1A0C] border-[rgba(74,229,74,0.2)] text-white placeholder:text-[#6B9E6B]/50 focus-visible:border-[#4AE54A] focus-visible:ring-[rgba(74,229,74,0.15)] rounded-xl h-11";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 1.5,
        duration: 1.5 + Math.random() * 1.5,
        size: 4 + Math.floor(Math.random() * 8),
        color: i % 3 === 0 ? "#4AE54A" : i % 3 === 1 ? "#22C55E" : "#86efac",
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            rotate: p.rotate,
          }}
          animate={{ y: ["0%", "110vh"], rotate: [p.rotate, p.rotate + 360] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const form = useForm<CompanyValues>({
    resolver: zodResolver(CompanySchema),
    defaultValues: { companyName: "", cnpj: "", phone: "", city: "" },
  });

  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [loading, setLoading] = React.useState(false);
  const [statusLoading, setStatusLoading] = React.useState(true);
  const [companyId, setCompanyId] = React.useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<PlanId>("pro");
  const [integrations, setIntegrations] = React.useState<Set<IntegrationId>>(new Set());

  const companyName = form.watch("companyName");
  const suggestedSlug = companyName ? slugify(companyName) : "";
  const progress = Math.round(((step) / 3) * 100);

  // ── Status ────────────────────────────────────────────────────────────────

  async function refreshStatus() {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/onboarding/status", { method: "GET" });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; companyId: string | null; vehicles: number; leads: number; completed: boolean }
        | { ok: false; error: string };
      if (!res.ok || !body || body.ok === false) throw new Error();
      setCompanyId(body.companyId);
      if (body.companyId && step === 0) setStep(1);
    } catch {
      // não bloqueia
    } finally {
      setStatusLoading(false);
    }
  }

  React.useEffect(() => {
    void refreshStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Company submit ────────────────────────────────────────────────────────

  async function onSubmitCompany(values: CompanyValues) {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sessão inválida.");

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

      setCompanyId(body.companyId);
      toast.success("Empresa criada!");
      advance();
    } catch (err: unknown) {
      toast.error("Erro ao criar empresa.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function advance() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-10 lg:-my-10 min-h-[calc(100vh-64px)] bg-[#0D1A0F] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Configure sua revenda
          </h1>
          <p className="text-sm text-[#6B9E6B]">
            Poucas etapas para começar a vender com MotorGestor.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 space-y-1.5">
          <div className="flex justify-between text-xs text-[#6B9E6B]">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[rgba(74,229,74,0.08)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#4AE54A] shadow-[0_0_8px_rgba(74,229,74,0.6)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </div>
        </div>

        {/* Stepper */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute inset-x-0 top-5 h-px bg-[rgba(74,229,74,0.1)]" />
          <motion.div
            className="absolute top-5 left-0 h-px bg-[#4AE54A] shadow-[0_0_6px_rgba(74,229,74,0.5)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          {STEPS.map((s, idx) => {
            const done = idx < step;
            const active = idx === step;
            const Icon = s.icon;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={[
                  "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  done ? "bg-[#1a3d1a] border-[#4AE54A]"
                    : active ? "bg-[#4AE54A] border-[#4AE54A] shadow-[0_0_16px_rgba(74,229,74,0.5)]"
                      : "bg-[#0F2014] border-[rgba(74,229,74,0.15)]",
                ].join(" ")}>
                  {done
                    ? <CheckIcon className="size-4 text-[#4AE54A]" />
                    : <Icon className={`size-4 ${active ? "text-[#0D1F1A]" : "text-[#6B9E6B]"}`} />}
                </div>
                <span className={[
                  "hidden sm:block text-xs font-semibold transition-colors",
                  active ? "text-[#4AE54A]" : done ? "text-[#6B9E6B]" : "text-[#6B9E6B]/40",
                ].join(" ")}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        {statusLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="size-6 animate-spin text-[#4AE54A]" />
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {/* ── Step 0: Empresa ── */}
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ x: direction * 48, opacity: 0, filter: "blur(6px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } }}
                  exit={{ x: direction * -48, opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } }}
                >
                  <StepCard icon={BuildingIcon} number={1} title="Sua empresa" description="Como a sua revenda se chama? Isso aparece nos documentos e comunicações.">
                    <form onSubmit={form.handleSubmit(onSubmitCompany)} className="space-y-4 mt-5">
                      <fieldset disabled={loading} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="companyName" className="text-[#6B9E6B] text-xs font-semibold">Nome da empresa *</Label>
                          <Input id="companyName" placeholder="Ex: Revenda Central" autoComplete="organization" className={inputCls} {...form.register("companyName")} />
                          {suggestedSlug && <p className="text-xs text-[#6B9E6B]/70">Slug: <span className="font-mono text-[#4AE54A]/80">{suggestedSlug}</span></p>}
                          {form.formState.errors.companyName && <p className="text-xs text-red-400">{form.formState.errors.companyName.message}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="cnpj" className="text-[#6B9E6B] text-xs font-semibold">CNPJ</Label>
                            <Input
                              id="cnpj"
                              placeholder="00.000.000/0001-00"
                              className={inputCls}
                              {...form.register("cnpj")}
                              onChange={(e) => {
                                form.setValue("cnpj", formatCNPJ(e.target.value));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-[#6B9E6B] text-xs font-semibold">Telefone</Label>
                            <Input
                              id="phone"
                              placeholder="(11) 99999-0000"
                              className={inputCls}
                              {...form.register("phone")}
                              onChange={(e) => {
                                form.setValue("phone", formatPhone(e.target.value));
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-[#6B9E6B] text-xs font-semibold">Cidade</Label>
                          <Input id="city" placeholder="São Paulo, SP" className={inputCls} {...form.register("city")} />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold text-sm shadow-[0_0_20px_rgba(74,229,74,0.25)] transition-all hover:-translate-y-0.5"
                        >
                          {loading ? <><Loader2Icon className="mr-2 size-4 animate-spin" />Salvando...</> : <>Próximo <ArrowRightIcon className="ml-2 size-4" /></>}
                        </Button>
                      </fieldset>
                    </form>
                  </StepCard>
                </motion.div>
              )}

              {/* ── Step 1: Plano ── */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ x: direction * 48, opacity: 0, filter: "blur(6px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } }}
                  exit={{ x: direction * -48, opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } }}
                >
                  <StepCard icon={CreditCardIcon} number={2} title="Escolha seu plano" description="Você pode mudar de plano a qualquer momento. Todos incluem período de teste grátis.">
                    <div className="grid sm:grid-cols-3 gap-3 mt-5">
                      {PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          className={[
                            "relative rounded-2xl border p-5 text-left transition-all duration-200 group",
                            selectedPlan === plan.id
                              ? "border-[#4AE54A] bg-[rgba(74,229,74,0.08)] shadow-[0_0_20px_rgba(74,229,74,0.15)]"
                              : "border-[rgba(74,229,74,0.12)] bg-[#0A1A0C] hover:border-[rgba(74,229,74,0.25)]",
                          ].join(" ")}
                        >
                          {plan.highlighted && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#4AE54A] text-[#0D1F1A] text-[10px] font-bold">
                              Popular
                            </div>
                          )}
                          {selectedPlan === plan.id && (
                            <div className="absolute top-3 right-3 size-5 rounded-full bg-[#4AE54A] flex items-center justify-center">
                              <CheckIcon className="size-3 text-[#0D1F1A]" />
                            </div>
                          )}
                          <div className="text-xs font-bold text-[#6B9E6B] mb-1">{plan.name}</div>
                          <div className="text-lg font-extrabold text-white mb-0.5">{plan.price}</div>
                          {plan.period && <div className="text-[10px] text-[#6B9E6B] mb-3">{plan.period}</div>}
                          <ul className="space-y-1 mt-3">
                            {plan.features.slice(0, 3).map((f) => (
                              <li key={f} className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                                <CheckIcon className="size-3 text-[#4AE54A] shrink-0" /> {f}
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button type="button" onClick={back} variant="outline" className="flex-1 h-11 rounded-xl border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.06)] bg-transparent">
                        Voltar
                      </Button>
                      <Button type="button" onClick={advance} className="flex-1 h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold shadow-[0_0_20px_rgba(74,229,74,0.25)]">
                        Próximo <ArrowRightIcon className="ml-2 size-4" />
                      </Button>
                    </div>
                  </StepCard>
                </motion.div>
              )}

              {/* ── Step 2: Integrações ── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ x: direction * 48, opacity: 0, filter: "blur(6px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } }}
                  exit={{ x: direction * -48, opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } }}
                >
                  <StepCard icon={LayoutGridIcon} number={3} title="Integrações" description="Conecte os marketplaces e ferramentas que você já usa. Você pode alterar depois.">
                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                      {INTEGRATIONS.map((int) => {
                        const enabled = integrations.has(int.id);
                        return (
                          <button
                            key={int.id}
                            type="button"
                            disabled={!int.available}
                            onClick={() => {
                              if (!int.available) return;
                              setIntegrations((prev) => {
                                const next = new Set(prev);
                                if (next.has(int.id)) next.delete(int.id);
                                else next.add(int.id);
                                return next;
                              });
                            }}
                            className={[
                              "relative rounded-2xl border p-4 text-left transition-all duration-200",
                              !int.available ? "opacity-60 cursor-not-allowed border-[rgba(74,229,74,0.08)] bg-[#0A1A0C]"
                                : enabled ? "border-[#4AE54A] bg-[rgba(74,229,74,0.06)]"
                                  : "border-[rgba(74,229,74,0.12)] bg-[#0A1A0C] hover:border-[rgba(74,229,74,0.25)]",
                            ].join(" ")}
                          >
                            {!int.available && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[9px] font-bold border border-yellow-500/30">
                                Em breve
                              </span>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="size-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
                                style={{ backgroundColor: int.color + "33", border: `1px solid ${int.color}40` }}
                              >
                                <span style={{ color: int.color }}>{int.name[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white">{int.name}</div>
                              </div>
                              {int.available && (
                                <div className={[
                                  "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                  enabled ? "bg-[#4AE54A] border-[#4AE54A]" : "border-[rgba(74,229,74,0.3)]",
                                ].join(" ")}>
                                  {enabled && <CheckIcon className="size-3 text-[#0D1F1A]" />}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-[#6B9E6B] leading-relaxed">{int.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button type="button" onClick={back} variant="outline" className="flex-1 h-11 rounded-xl border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.06)] bg-transparent">
                        Voltar
                      </Button>
                      <Button type="button" onClick={advance} className="flex-1 h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold shadow-[0_0_20px_rgba(74,229,74,0.25)]">
                        Próximo <ArrowRightIcon className="ml-2 size-4" />
                      </Button>
                    </div>
                  </StepCard>
                </motion.div>
              )}

              {/* ── Step 3: Pronto! ── */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ x: direction * 48, opacity: 0, filter: "blur(6px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } }}
                  exit={{ x: direction * -48, opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] shadow-[0_0_30px_rgba(74,229,74,0.06)] p-8 sm:p-10 text-center">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.35)] to-transparent" />
                    <Confetti />

                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      className="inline-flex items-center justify-center size-20 rounded-full bg-[#4AE54A] shadow-[0_0_40px_rgba(74,229,74,0.4)] mb-6 relative"
                    >
                      <ZapIcon className="size-10 text-[#0D1F1A]" />
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                      Tudo pronto! 🎉
                    </h2>
                    <p className="text-[#6B9E6B] mb-8 max-w-md mx-auto">
                      Sua revenda está configurada no plano{" "}
                      <span className="text-[#4AE54A] font-bold capitalize">{selectedPlan}</span>. Explore o dashboard e comece a cadastrar veículos e leads.
                    </p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => { router.replace("/app"); router.refresh(); }}
                        className="w-full h-12 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold text-base shadow-[0_0_24px_rgba(74,229,74,0.3)] transition-all hover:-translate-y-0.5"
                      >
                        Acessar Dashboard <ArrowRightIcon className="ml-2 size-5" />
                      </Button>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1 h-10 rounded-xl border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:text-white bg-transparent hover:bg-[rgba(74,229,74,0.06)] text-sm">
                          <Link href="/app/veiculos/novo">Adicionar veículo</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 h-10 rounded-xl border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:text-white bg-transparent hover:bg-[rgba(74,229,74,0.06)] text-sm">
                          <Link href="/app/leads/novo">Criar lead</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────

function StepCard({
  icon: Icon,
  number,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] shadow-[0_0_30px_rgba(74,229,74,0.06)] p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.35)] to-transparent" />
      <div className="flex items-center gap-3 mb-2">
        <div className="size-8 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center">
          <Icon className="size-4 text-[#4AE54A]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#6B9E6B]">Passo {number}</span>
        </div>
      </div>
      <h2 className="text-xl font-extrabold text-white mb-1">{title}</h2>
      <p className="text-sm text-[#6B9E6B] leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
