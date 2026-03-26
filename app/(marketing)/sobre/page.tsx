import Link from "next/link";
import { ArrowRightIcon, TargetIcon, ShieldIcon, HeartIcon, MapIcon, MessageCircleIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

export default function SobrePage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-4xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Sobre
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Feito para a realidade de quem{" "}
              <span className="text-[#4AE54A]">vende carro todo dia</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg max-w-2xl mx-auto mb-8">
              Menos burocracia, mais previsibilidade. O MotorGestor nasceu para
              organizar a operação de revendas pequenas e vendedores autônomos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_24px_rgba(74,229,74,0.3)]"
              >
                Começar agora <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
              >
                Falar com a equipe
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* 3 principles */}
      <section className="py-16 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: TargetIcon,
                label: "Missão",
                text: "Ajudar pequenas operações a vender mais com processo simples, dados organizados e rotina de atendimento clara.",
              },
              {
                icon: ShieldIcon,
                label: "Princípios",
                items: [
                  "Foco no essencial e rapidez no dia a dia",
                  "Segurança real com isolamento por empresa",
                  "UX limpa: menos cliques, mais clareza",
                ],
              },
              {
                icon: HeartIcon,
                label: "Transparência",
                text: "Preços simples, suporte humano e roadmap guiado por problemas reais do balcão e do WhatsApp.",
              },
            ].map((card) => (
              <FadeUp key={card.label}>
                <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 h-full">
                  <div className="size-10 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4">
                    <card.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <div className="text-xs font-bold text-[#4AE54A] uppercase tracking-widest mb-3">{card.label}</div>
                  {card.text && <p className="text-[#6B9E6B] text-sm leading-relaxed">{card.text}</p>}
                  {card.items && (
                    <ul className="space-y-2">
                      {card.items.map((item) => (
                        <li key={item} className="text-[#6B9E6B] text-sm flex items-start gap-2">
                          <span className="text-[#4AE54A] mt-0.5">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* Why section */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-5xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Por que MotorGestor?
                  </h2>
                  <p className="text-[#6B9E6B] leading-relaxed">
                    Porque &ldquo;gerir motor&rdquo; aqui é gerir a operação: estoque, leads,
                    agenda e resultado. Sem depender de planilha, sem perder cliente
                    por falta de acompanhamento, sem achismo na hora de medir conversão.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: MapIcon,
                      title: "Roadmap aberto",
                      desc: "Integrações, automações e relatórios avançados conforme o produto evolui. Guiado por feedback real.",
                    },
                    {
                      icon: MessageCircleIcon,
                      title: "Suporte humano",
                      desc: "Atendimento em português, rápido e feito por quem conhece o mercado de revendas.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-[#4AE54A]/10 bg-[#0D1F1A] p-4 flex gap-3">
                      <div className="size-9 rounded-lg bg-[rgba(74,229,74,0.1)] flex items-center justify-center shrink-0">
                        <item.icon className="size-4 text-[#4AE54A]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                        <p className="text-[#6B9E6B] text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
