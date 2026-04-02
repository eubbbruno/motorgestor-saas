"use client";

import * as React from "react";
import { HeartIcon, ZapIcon, UsersIcon, SendIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const culture = [
  {
    icon: ZapIcon,
    title: "Produto enxuto",
    description: "Não construímos por construir. Cada feature resolve um problema real de uma revenda brasileira.",
  },
  {
    icon: UsersIcon,
    title: "Impacto direto",
    description: "Time pequeno, decisões rápidas. Você vê sua contribuição no produto em dias, não meses.",
  },
  {
    icon: HeartIcon,
    title: "Trabalho remoto",
    description: "Autonomia para trabalhar de onde você estiver, com foco em entregas e qualidade.",
  },
];

const inputClass =
  "w-full h-11 rounded-xl border border-[#4AE54A]/20 bg-[#0A1A0C] px-4 text-sm text-white placeholder:text-[#6B9E6B]/50 focus:outline-none focus:border-[#4AE54A]/60 transition-colors";

const labelClass = "block text-xs font-semibold text-[#6B9E6B] uppercase tracking-wider mb-2";

export default function CarreirasPage() {
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Carreiras
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Construa o futuro da gestão{" "}
              <span className="text-[#4AE54A]">para revendas brasileiras</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Produto enxuto, impacto direto e foco em resolver problemas reais de operação e vendas.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* No open positions */}
      <section className="pb-16 bg-[#0A1A0C]">
        <Container className="max-w-2xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-10 text-center">
              <div className="size-14 rounded-2xl bg-[rgba(74,229,74,0.10)] flex items-center justify-center mx-auto mb-5">
                <UsersIcon className="size-7 text-[#4AE54A]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Nenhuma vaga aberta no momento</h2>
              <p className="text-[#6B9E6B] text-sm leading-relaxed">
                Não temos vagas ativas agora, mas estamos sempre de olho em talentos. Se você acredita que pode contribuir,
                deixe seu contato abaixo e entraremos em contato quando uma oportunidade aparecer.
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Culture */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-4xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-white text-center mb-8">Nossa cultura</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {culture.map((c) => (
                <div key={c.title} className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6">
                  <div className="size-10 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4">
                    <c.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Interest form */}
      <section className="py-16 bg-[#0A1A0C]">
        <Container className="max-w-xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <h2 className="text-lg font-bold text-white mb-2">Cadastre seu interesse</h2>
              <p className="text-[#6B9E6B] text-sm mb-6">
                Envie seu perfil e área de interesse. Quando uma vaga surgir, você será um dos primeiros a saber.
              </p>

              {sent ? (
                <div className="text-center py-6">
                  <div className="size-12 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center mx-auto mb-3">
                    <SendIcon className="size-5 text-[#4AE54A]" />
                  </div>
                  <p className="text-white font-semibold">Interesse registrado!</p>
                  <p className="text-[#6B9E6B] text-sm mt-1">Entraremos em contato quando uma oportunidade surgir.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input className={inputClass} placeholder="Seu nome" required />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" className={inputClass} placeholder="voce@email.com" required />
                  </div>
                  <div>
                    <label className={labelClass}>Área de interesse</label>
                    <select className={`${inputClass} cursor-pointer`} required>
                      <option value="" className="bg-[#0F2014]">Selecione...</option>
                      <option value="dev" className="bg-[#0F2014]">Desenvolvimento</option>
                      <option value="design" className="bg-[#0F2014]">Design</option>
                      <option value="cs" className="bg-[#0F2014]">Customer Success</option>
                      <option value="marketing" className="bg-[#0F2014]">Marketing</option>
                      <option value="outro" className="bg-[#0F2014]">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Linkedin ou portfolio (opcional)</label>
                    <input className={inputClass} placeholder="linkedin.com/in/..." />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors"
                  >
                    Enviar interesse
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
