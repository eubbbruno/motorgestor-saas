import Link from "next/link";
import { BookOpenIcon, LifeBuoyIcon, MessageSquareIcon, ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

const categories = [
  {
    icon: BookOpenIcon,
    title: "Começando",
    items: [
      "Criar conta e configurar empresa",
      "Cadastrar veículos e organizar estoque",
      "Registrar leads e acompanhar funil",
    ],
  },
  {
    icon: LifeBuoyIcon,
    title: "Operação",
    items: ["Agenda e retornos", "Boas práticas de pipeline", "Relatórios básicos"],
  },
  {
    icon: MessageSquareIcon,
    title: "Conta & segurança",
    items: ["Acesso e permissões", "Privacidade e RLS", "Problemas de login"],
  },
];

export default function SuportePage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Suporte
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Ajuda para operar melhor{" "}
              <span className="text-[#4AE54A]">sem perder tempo</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg mb-8">
              Guias, melhores práticas e caminhos rápidos para resolver dúvidas comuns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_24px_rgba(74,229,74,0.3)]"
              >
                Falar com suporte <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
              >
                Ver recursos
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Categories */}
      <section className="pb-16 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <StaggerSection className="grid gap-5 lg:grid-cols-3">
            {categories.map((c) => (
              <StaggerItem key={c.title}>
                <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/30 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="size-11 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4">
                    <c.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <h3 className="font-semibold text-white mb-3">{c.title}</h3>
                  <ul className="space-y-2">
                    {c.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#6B9E6B]">
                        <span className="text-[#4AE54A] mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* CTA card */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-3xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <h2 className="text-lg font-bold text-white mb-2">Precisa de atendimento?</h2>
                  <p className="text-sm text-[#6B9E6B]">
                    Envie detalhes da sua operação e do que você está tentando fazer. Quanto mais contexto, mais rápido resolvemos.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:justify-self-end">
                  <Link
                    href="/contato"
                    className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors w-full"
                  >
                    Abrir chamado
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
