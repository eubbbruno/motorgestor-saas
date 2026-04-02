import Link from "next/link";
import { HandshakeIcon, MegaphoneIcon, BadgeCheckIcon, ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

const partnerTypes = [
  {
    icon: HandshakeIcon,
    title: "Consultorias e implantação",
    description:
      "Ajude revendas a estruturar processo e adotar o MotorGestor. Acompanhe onboarding e colha feedback direto para evoluir.",
  },
  {
    icon: MegaphoneIcon,
    title: "Agências e tráfego",
    description:
      "Integre campanhas e feche o ciclo de leads. Veja o que converte de fato com dados do funil de cada cliente.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Parceiros tecnológicos",
    description:
      "Integrações com CRMs, telefonia, BI e ferramentas de mensagens. Construa sobre nossa base de dados aberta.",
  },
];

const howItWorks = [
  "Você indica ou implanta clientes e acompanha adoção.",
  "Recebe benefícios, materiais e suporte para acelerar vendas.",
  "Feedback direto com o time de produto para evoluir integrações.",
];

export default function ParceirosPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Parceiros
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Parcerias para{" "}
              <span className="text-[#4AE54A]">acelerar resultados</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg mb-8">
              Trabalhe com a gente para levar operação organizada e previsibilidade para revendas brasileiras.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_24px_rgba(74,229,74,0.3)]"
            >
              Quero ser parceiro <ArrowRightIcon className="size-4" />
            </Link>
          </FadeUp>
        </Container>
      </section>

      {/* Partner types */}
      <section className="pb-20 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <StaggerSection className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map((p) => (
              <StaggerItem key={p.title}>
                <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/30 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="size-11 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4">
                    <p.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">{p.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-3xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <h2 className="text-xl font-bold text-white mb-6">Como funciona o programa</h2>
              <ul className="space-y-4">
                {howItWorks.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#4AE54A]">{i + 1}</span>
                    </div>
                    <p className="text-[#6B9E6B] text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-[#4AE54A]/10">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-xl border border-[rgba(74,229,74,0.3)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
                >
                  Vamos conversar
                </Link>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
