import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recursos e Funcionalidades",
  description:
    "Gestão de estoque, CRM de leads, integração com marketplaces e relatórios completos para sua revenda.",
};
import {
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  LockIcon,
  TagIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckIcon,
} from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

const features = [
  {
    icon: CarIcon,
    title: "Gestão de Veículos",
    description:
      "Cadastro completo com FIPE integrada, fotos, status (disponível, reservado, vendido) e geração de anúncios para OLX e Webmotors.",
  },
  {
    icon: UsersIcon,
    title: "Pipeline de Leads",
    description:
      "Funil Kanban visual: Novo → Contato → Visita → Proposta → Ganho/Perdido. Com notas, histórico e WhatsApp integrado.",
  },
  {
    icon: CalendarIcon,
    title: "Agenda e Follow-ups",
    description:
      "Agende retornos e test-drives. Eventos vinculados ao lead, com horários e lembretes para não perder nenhum timing.",
  },
  {
    icon: BarChart3Icon,
    title: "Dashboard e Relatórios",
    description:
      "KPIs em tempo real: volume de leads, conversão por etapa, evolução mensal e ticket médio.",
  },
  {
    icon: TagIcon,
    title: "Multi-empresa",
    description:
      "Cada revenda é um tenant isolado. Dados protegidos por Row-Level Security no banco — não só na interface.",
  },
  {
    icon: LockIcon,
    title: "Segurança e Permissões",
    description:
      "Papéis Admin e Vendedor com regras de acesso por company_id diretamente no Postgres.",
  },
];

export default function RecursosPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-4xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Recursos
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Tudo que sua revenda precisa{" "}
              <span className="text-[#4AE54A]">para vender mais</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg max-w-2xl mx-auto mb-8">
              Foco no essencial: estoque, leads, agenda e métricas. Sem complexidade desnecessária.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_24px_rgba(74,229,74,0.3)]"
              >
                Começar grátis <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/planos"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
              >
                Ver planos
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Feature cards */}
      <section className="py-16 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <StaggerSection className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="group bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/40 hover:shadow-[0_0_30px_rgba(74,229,74,0.08)] hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="size-11 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">{f.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* Stack info */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-5xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Next.js 15", "Supabase + RLS", "shadcn/ui"].map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(74,229,74,0.1)] border border-[rgba(74,229,74,0.2)] text-[#4AE54A]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stack moderna, segurança por padrão
                  </h2>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">
                    O MotorGestor foi pensado para ser rápido no dia a dia e seguro
                    por padrão — com isolamento real de dados por empresa, login seguro
                    e banco relacional pronto para crescer.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Auth + Postgres", desc: "Login seguro com Supabase e banco relacional otimizado." },
                    { title: "RLS por company_id", desc: "Permissões no banco — não só na UI. Dados isolados por empresa." },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-[#4AE54A]/10 bg-[#0D1F1A] p-4">
                      <div className="flex items-start gap-3">
                        <div className="size-5 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="size-3 text-[#4AE54A]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                          <p className="text-[#6B9E6B] text-xs leading-relaxed">{item.desc}</p>
                        </div>
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
