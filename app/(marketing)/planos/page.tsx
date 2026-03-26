import Link from "next/link";
import { CheckIcon, ArrowRightIcon, MessageCircleIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Para organizar o básico e rodar o primeiro funil.",
    features: [
      "Até 5 veículos no estoque",
      "Até 20 leads ativos",
      "Pipeline Kanban visual",
      "Dashboard de métricas",
      "Agenda de follow-ups",
    ],
    cta: "Começar grátis",
    href: "/cadastro",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 99",
    period: "/mês",
    description: "Para operar todo dia com escala, padrão e IA.",
    features: [
      "Até 1.000 veículos no estoque",
      "Leads ilimitados",
      "FIPE integrada",
      "WhatsApp + histórico completo",
      "Gerador de anúncios (OLX, Webmotors)",
      "Importação CSV de leads",
      "Proposta em PDF",
      "IA para descrições e mensagens",
    ],
    cta: "Assinar Pro",
    href: "/cadastro",
    highlight: true,
  },
];

const comparison = [
  { label: "Veículos no estoque", free: "5", pro: "1.000" },
  { label: "Leads ativos", free: "20", pro: "Ilimitados" },
  { label: "Pipeline Kanban", free: "✓", pro: "✓" },
  { label: "Métricas em tempo real", free: "✓", pro: "✓" },
  { label: "FIPE integrada", free: "—", pro: "✓" },
  { label: "WhatsApp + histórico", free: "—", pro: "✓" },
  { label: "Gerador de anúncios", free: "—", pro: "✓" },
  { label: "Proposta em PDF", free: "—", pro: "✓" },
  { label: "IA (mensagens/descrições)", free: "—", pro: "✓" },
];

export default function PlanosPage() {
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
              Escolha um plano que{" "}
              <span className="text-[#4AE54A]">acompanha sua operação</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Comece no Free sem cartão. Faça upgrade quando precisar de mais.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Plan cards */}
      <section className="pb-16 bg-[#0A1A0C]">
        <Container className="max-w-4xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {plans.map((p) => (
              <FadeUp key={p.name}>
                <div className={`relative rounded-2xl p-8 border h-full flex flex-col ${
                  p.highlight
                    ? "bg-[#0F2014] border-[#4AE54A]/40 shadow-[0_0_40px_rgba(74,229,74,0.12)]"
                    : "bg-[#0F2014] border-[#4AE54A]/15"
                }`}>
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-[#4AE54A] text-[#0D1F1A]">
                        Recomendado
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="text-xs font-bold text-[#4AE54A] uppercase tracking-widest mb-2">
                      {p.name}
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-bold text-white">{p.price}</span>
                      <span className="text-[#6B9E6B] text-sm pb-1">{p.period}</span>
                    </div>
                    <p className="text-[#6B9E6B] text-sm">{p.description}</p>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-8">
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
                    className={`w-full flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm transition-all ${
                      p.highlight
                        ? "bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] shadow-[0_0_20px_rgba(74,229,74,0.3)] hover:-translate-y-0.5"
                        : "border border-[rgba(74,229,74,0.3)] text-white hover:bg-[rgba(74,229,74,0.06)]"
                    }`}
                  >
                    {p.cta} {p.highlight && <ArrowRightIcon className="size-4" />}
                  </Link>
                  {!p.highlight && (
                    <p className="text-center text-xs text-[#6B9E6B]/50 mt-3">
                      Sem cartão de crédito
                    </p>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-3xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Comparação rápida
            </h2>
            <div className="rounded-2xl border border-[#4AE54A]/15 overflow-hidden bg-[#0F2014]">
              <div className="grid grid-cols-3">
                <div className="p-4 text-xs font-bold text-[#6B9E6B] uppercase tracking-wider">Recurso</div>
                <div className="border-l border-[#4AE54A]/10 p-4 text-xs font-bold text-white uppercase tracking-wider text-center">Free</div>
                <div className="border-l border-[#4AE54A]/10 p-4 text-xs font-bold text-[#4AE54A] uppercase tracking-wider text-center">Pro</div>
                {comparison.map((r, i) => (
                  <>
                    <div key={`l-${r.label}`} className={`p-4 text-sm text-[#9CA3AF] ${i % 2 === 0 ? "bg-[#0D1F1A]" : ""}`}>{r.label}</div>
                    <div key={`f-${r.label}`} className={`border-l border-[#4AE54A]/10 p-4 text-sm text-center ${i % 2 === 0 ? "bg-[#0D1F1A]" : ""} ${r.free === "—" ? "text-[#6B9E6B]/40" : "text-white"}`}>{r.free}</div>
                    <div key={`p-${r.label}`} className={`border-l border-[#4AE54A]/10 p-4 text-sm text-center ${i % 2 === 0 ? "bg-[#0D1F1A]" : ""} ${r.pro === "✓" ? "text-[#4AE54A]" : "text-white"}`}>{r.pro}</div>
                  </>
                ))}
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#0A1A0C]">
        <Container className="max-w-2xl text-center">
          <FadeUp>
            <p className="text-[#6B9E6B] mb-4">Tem dúvidas sobre qual plano escolher?</p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
            >
              <MessageCircleIcon className="size-4 text-[#4AE54A]" />
              Falar com a equipe
            </Link>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
