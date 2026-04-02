"use client";

import * as React from "react";
import Link from "next/link";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const plans = [
  {
    key: "starter",
    name: "Starter",
    monthlyPrice: 97,
    description: "Para a revenda que quer sair das planilhas e organizar o básico.",
    features: [
      "1 usuário",
      "Até 50 veículos cadastrados",
      "Leads ilimitados",
      "Integração FIPE",
      "Pipeline Kanban",
      "Suporte por email",
      "Trial 14 dias grátis",
    ],
    cta: "Começar trial",
    href: "/cadastro",
    highlight: false,
    badge: null,
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 197,
    description: "Para a revenda que quer crescer com processo, dados e integrações.",
    features: [
      "Até 5 usuários",
      "Veículos ilimitados",
      "Webmotors + OLX + iCarros",
      "Relatórios avançados",
      "Suporte prioritário via chat",
      "Dashboard de métricas",
      "Trial 14 dias grátis",
    ],
    cta: "Começar trial",
    href: "/cadastro",
    highlight: true,
    badge: "Mais popular",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthlyPrice: 397,
    description: "Para grupos de revendas ou operações que exigem controle total.",
    features: [
      "Usuários ilimitados",
      "Tudo do plano Pro",
      "WhatsApp integrado",
      "Gestor de conta dedicado",
      "Onboarding personalizado",
      "SLA garantido",
    ],
    cta: "Falar com vendas",
    href: "/contato",
    highlight: false,
    badge: null,
  },
];

const faqs = [
  {
    q: "Preciso informar cartão de crédito para o trial?",
    a: "Não. Os 14 dias de trial são completamente gratuitos e não exigem cartão. Você só paga se decidir continuar.",
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim, a qualquer momento. Se fizer upgrade, a diferença é cobrada pro-rata. Downgrade entra no próximo ciclo.",
  },
  {
    q: "Como funciona o desconto anual?",
    a: "Pagando anualmente você tem 20% de desconto sobre o valor mensal. O valor é cobrado uma vez por ano.",
  },
  {
    q: "O que acontece com meus dados se cancelar?",
    a: "Você pode exportar todos os dados a qualquer momento. Após o cancelamento, mantemos os dados por 30 dias antes da exclusão definitiva.",
  },
];

export default function PlanosPage() {
  const [annual, setAnnual] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  function price(monthly: number) {
    const v = annual ? Math.round(monthly * 0.8) : monthly;
    return v.toLocaleString("pt-BR");
  }

  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Planos
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Simples, transparente,{" "}
              <span className="text-[#4AE54A]">sem surpresas</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg mb-8">
              Todas as empresas começam com 14 dias grátis. Sem cartão de crédito.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 rounded-full border border-[#4AE54A]/20 bg-[#0F2014] p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  !annual
                    ? "bg-[#4AE54A] text-[#0D1F1A]"
                    : "text-[#6B9E6B] hover:text-white"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  annual
                    ? "bg-[#4AE54A] text-[#0D1F1A]"
                    : "text-[#6B9E6B] hover:text-white"
                }`}
              >
                Anual
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${annual ? "bg-[#0D1F1A] text-[#4AE54A]" : "bg-[#4AE54A]/20 text-[#4AE54A]"}`}>
                  -20%
                </span>
              </button>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Plan cards */}
      <section className="pb-20 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-3 items-start">
            {plans.map((p) => (
              <div
                key={p.key}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  p.highlight
                    ? "bg-[#0F2014] border-2 border-[#4AE54A] shadow-[0_0_40px_rgba(74,229,74,0.15)] lg:scale-105"
                    : "bg-[#0F2014] border border-[#4AE54A]/20"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-[#4AE54A] text-[#0D1F1A]">
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-xs font-bold text-[#4AE54A] uppercase tracking-widest mb-3">
                    {p.name}
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">
                      R$ {price(p.monthlyPrice)}
                    </span>
                    <span className="text-[#6B9E6B] text-sm pb-1">/mês</span>
                  </div>
                  {annual && (
                    <div className="text-xs text-[#4AE54A] font-semibold mb-2">
                      Cobrado anualmente · 2 meses grátis
                    </div>
                  )}
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">{p.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="size-5 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon className="size-3 text-[#4AE54A]" />
                      </div>
                      <span className="text-[#9CA3AF] text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`w-full flex items-center justify-center h-11 rounded-xl font-bold text-sm transition-all ${
                    p.highlight
                      ? "bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] shadow-[0_0_20px_rgba(74,229,74,0.3)] hover:-translate-y-0.5"
                      : "border border-[rgba(74,229,74,0.3)] text-white hover:bg-[rgba(74,229,74,0.06)]"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Trial note */}
          <div className="mt-10 text-center">
            <p className="text-[#6B9E6B] text-sm">
              Todas as empresas começam com{" "}
              <span className="text-white font-semibold">14 dias grátis</span>. Sem cartão de crédito.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-2xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-white text-center mb-10">
              Perguntas frequentes sobre planos
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUpIcon className="size-4 text-[#4AE54A] shrink-0" />
                    ) : (
                      <ChevronDownIcon className="size-4 text-[#6B9E6B] shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-[#6B9E6B] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1A0C]">
        <Container className="max-w-2xl text-center">
          <FadeUp>
            <p className="text-[#6B9E6B] mb-4">Ainda tem dúvidas sobre qual plano escolher?</p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
            >
              Falar com a equipe
            </Link>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
