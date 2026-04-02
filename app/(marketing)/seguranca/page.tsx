import Link from "next/link";
import { LockIcon, ShieldCheckIcon, DatabaseIcon, KeyIcon, ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";

const items = [
  {
    icon: ShieldCheckIcon,
    title: "RLS por empresa (company_id)",
    description:
      "As permissões vivem no banco: cada usuário só enxerga dados do seu tenant, mesmo se tentar acessar diretamente.",
  },
  {
    icon: KeyIcon,
    title: "Auth gerenciado (Supabase)",
    description:
      "Sessões seguras, tokens JWT e fluxo de autenticação com boas práticas de segurança.",
  },
  {
    icon: DatabaseIcon,
    title: "Postgres relacional",
    description:
      "Integridade com chaves estrangeiras, índices e regras — pronto para crescer com o produto sem abrir mão da segurança.",
  },
  {
    icon: LockIcon,
    title: "Papéis e controle de acesso",
    description:
      "Papéis Admin e Vendedor com regras claras. Admin gerencia configurações e tem visão mais ampla da operação.",
  },
];

export default function SegurancaPage() {
  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Segurança
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Segurança por padrão{" "}
              <span className="text-[#4AE54A]">multi-tenant de verdade</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg mb-8">
              Isolamento por empresa com Row Level Security no Postgres. Autenticação segura e boas práticas em cada camada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_24px_rgba(74,229,74,0.3)]"
              >
                Criar conta <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/privacidade"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[rgba(74,229,74,0.25)] text-white text-sm hover:bg-[rgba(74,229,74,0.06)] transition-colors"
              >
                Política de Privacidade
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Security items */}
      <section className="pb-16 bg-[#0A1A0C]">
        <Container className="max-w-4xl">
          <StaggerSection className="grid gap-5 sm:grid-cols-2">
            {items.map((i) => (
              <StaggerItem key={i.title}>
                <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/30 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="size-11 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center mb-4">
                    <i.icon className="size-5 text-[#4AE54A]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{i.title}</h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">{i.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* RLS explainer */}
      <section className="py-16 bg-[#0D1F1A]">
        <Container className="max-w-3xl">
          <FadeUp>
            <div className="rounded-2xl border border-[#4AE54A]/15 bg-[#0F2014] p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(74,229,74,0.1)] border border-[rgba(74,229,74,0.2)] text-[#4AE54A] mb-4">
                O que é RLS?
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                Row Level Security — segurança no banco, não só na UI
              </h2>
              <p className="text-[#6B9E6B] text-sm leading-relaxed mb-4">
                Mesmo que alguém tente consultar diretamente o banco, as políticas do Postgres
                impedem leitura e escrita fora do tenant correto. É uma camada forte de segurança
                que não depende da aplicação.
              </p>
              <p className="text-[#6B9E6B] text-sm leading-relaxed">
                Todas as tabelas principais (
                <code className="font-mono text-[#4AE54A] text-xs">profiles</code>,{" "}
                <code className="font-mono text-[#4AE54A] text-xs">companies</code>,{" "}
                <code className="font-mono text-[#4AE54A] text-xs">vehicles</code>,{" "}
                <code className="font-mono text-[#4AE54A] text-xs">leads</code>,{" "}
                <code className="font-mono text-[#4AE54A] text-xs">events</code>
                ) têm políticas RLS ativas.
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
