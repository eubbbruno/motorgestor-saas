"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: "🚗",
    title: "Bem-vindo ao MotorGestor",
    description:
      "A plataforma completa para gerenciar sua concessionária. Vamos te mostrar o que você pode fazer.",
  },
  {
    icon: "🚘",
    title: "Cadastre seus veículos",
    description:
      "Adicione seu estoque em segundos. Fotos, preços e detalhes em um só lugar.",
  },
  {
    icon: "📋",
    title: "Gerencie seus leads",
    description:
      "Acompanhe cada cliente interessado e nunca perca uma venda.",
  },
  {
    icon: "📡",
    title: "Publique nos marketplaces",
    description:
      "Integre com Webmotors, OLX e iCarros com um clique.",
  },
  {
    icon: "✅",
    title: "Tudo pronto!",
    description: "Sua conta está configurada. Vamos começar?",
  },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function finishTour() {
  try {
    await fetch("/api/onboarding/complete", { method: "POST" });
  } catch {
    // ignora — o redirect vai forçar reavaliação do middleware de qualquer forma
  }
  window.location.href = "/app";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  async function handleNext() {
    if (isLast) {
      setLoading(true);
      await finishTour();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleSkip() {
    setLoading(true);
    await finishTour();
  }

  return (
    /* Overlay */
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[#4AE54A]/20 bg-[#0F2014] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
        {/* Skip */}
        <button
          onClick={handleSkip}
          disabled={loading}
          className="absolute top-4 right-5 text-sm text-[#6B9E6B] hover:text-[#9CA3AF] transition-colors disabled:opacity-40"
        >
          Pular
        </button>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center gap-5"
          >
            {/* Icon */}
            <span className="text-[48px] leading-none select-none" role="img" aria-label={current.title}>
              {current.icon}
            </span>

            {/* Title */}
            <h1
              className="text-[22px] font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {current.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs">
              {current.description}
            </p>

            {/* CTA */}
            <button
              onClick={handleNext}
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl bg-[#4AE54A] text-[#0D1F1A] text-sm font-bold shadow-[0_0_20px_rgba(74,229,74,0.3)] hover:bg-[#3dd13d] hover:shadow-[0_0_28px_rgba(74,229,74,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Carregando…" : isLast ? "Acessar Dashboard →" : "Próximo →"}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={[
                "rounded-full transition-all duration-300",
                i === step
                  ? "w-4 h-[7px] bg-[#4AE54A]"
                  : i < step
                  ? "w-[7px] h-[7px] bg-[#4AE54A]/40"
                  : "w-[7px] h-[7px] bg-white/10",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
