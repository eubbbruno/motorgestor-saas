import Link from "next/link";
import { MessageCircleIcon, CarIcon, BarChart2Icon, ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

const integrations = [
  {
    icon: MessageCircleIcon,
    title: "WhatsApp Business",
    description: "Atenda leads diretamente pelo WhatsApp sem sair do MotorGestor. Histórico completo de conversas vinculado ao lead.",
    status: "Em breve",
    statusColor: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    icon: CarIcon,
    title: "OLX",
    description: "Publique anúncios automaticamente no OLX a partir do seu estoque. Atualize preços e status sem retrabalho.",
    status: "Disponível",
    statusColor: "bg-[#4AE54A]/10 text-[#4AE54A] border-[#4AE54A]/20",
  },
  {
    icon: CarIcon,
    title: "Webmotors",
    description: "Sincronize seu estoque em tempo real com a Webmotors. Publicação e edição de anúncios automáticos.",
    status: "Disponível",
    statusColor: "bg-[#4AE54A]/10 text-[#4AE54A] border-[#4AE54A]/20",
  },
  {
    icon: CarIcon,
    title: "iCarros",
    description: "Alcance mais compradores publicando no iCarros diretamente pela plataforma, sem logar em outro sistema.",
    status: "Disponível",
    statusColor: "bg-[#4AE54A]/10 text-[#4AE54A] border-[#4AE54A]/20",
  },
  {
    icon: BarChart2Icon,
    title: "Tabela FIPE",
    description: "Consulte preços de mercado na tabela FIPE durante o cadastro de veículos. Precifique com mais precisão e agilidade.",
    status: "Disponível",
    statusColor: "bg-[#4AE54A]/10 text-[#4AE54A] border-[#4AE54A]/20",
  },
];

export default function IntegracoesPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Integrações
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Conecte onde seus clientes{" "}
              <span className="text-[#4AE54A]">já estão</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Publique anúncios, consulte FIPE e atenda pelo WhatsApp — tudo dentro do MotorGestor.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Integration cards */}
      <section className="pb-20 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <StaggerSection className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((i) => (
              <StaggerItem key={i.title}>
                <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/30 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="size-11 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center shrink-0">
                      <i.icon className="size-5 text-[#4AE54A]" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${i.statusColor}`}>
                      {i.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{i.title}</h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed flex-1">{i.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-2xl text-center">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-10">
              <h2 className="text-2xl font-bold text-white mb-3">Quer pedir uma integração?</h2>
              <p className="text-[#6B9E6B] text-sm mb-6">
                Conta qual sistema você usa. Priorizamos as integrações mais pedidas pelos clientes.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors"
              >
                Pedir integração <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
