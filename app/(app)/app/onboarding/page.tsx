"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

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

const TOTAL = STEPS.length;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const isLast = step === TOTAL - 1;
  const progress = Math.round(((step + 1) / TOTAL) * 100);

  function next() {
    if (isLast) {
      router.replace("/app/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  }

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 bg-[#0D1F1A] flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[rgba(74,229,74,0.1)] z-10">
        <motion.div
          className="h-full bg-[#4AE54A] shadow-[0_0_8px_rgba(74,229,74,0.7)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Skip link */}
      <div className="absolute top-5 right-6 z-10">
        <Link
          href="/app/dashboard"
          className="text-sm text-[#6B9E6B] hover:text-[#9CA3AF] transition-colors"
        >
          Pular tour
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Icon */}
              <div className="text-[64px] leading-none select-none" role="img" aria-label={current.title}>
                {current.icon}
              </div>

              {/* Title */}
              <h1
                className="text-[28px] font-bold text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {current.title}
              </h1>

              {/* Description */}
              <p className="text-[#9CA3AF] text-base leading-relaxed max-w-sm">
                {current.description}
              </p>

              {/* Button */}
              <button
                onClick={next}
                className="mt-2 px-8 py-3 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-base shadow-[0_0_24px_rgba(74,229,74,0.35)] hover:bg-[#3dd13d] hover:shadow-[0_0_32px_rgba(74,229,74,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLast ? "Acessar Dashboard →" : "Próximo →"}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 pb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={[
              "rounded-full transition-all duration-300",
              i === step
                ? "w-5 h-2 bg-[#4AE54A]"
                : i < step
                ? "w-2 h-2 bg-[#4AE54A]/40"
                : "w-2 h-2 bg-[rgba(74,229,74,0.15)]",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
