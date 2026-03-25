import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  MessageCircleIcon,
  ShieldIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { FadeUp } from "@/components/site/fade-up";
import { FaqSection } from "@/components/site/faq-section";
import Image from "next/image";
import { HeroBackground } from "@/components/site/hero-background";
import { AnimatedStats } from "@/components/site/animated-stats";
import { StaggerSection, StaggerItem } from "@/components/site/stagger-section";
import { HeroTextMotion } from "@/components/site/hero-parallax-text";

const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// ─── Decorative helpers ───────────────────────────────────────────────────────

function DotPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(74,229,74,0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

function GreenBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute w-96 h-96 bg-[#4AE54A]/[0.08] rounded-full blur-[120px] pointer-events-none ${className}`}
    />
  );
}

function SectionDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.30)] to-transparent" />
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const features4 = [
  {
    icon: CarIcon,
    iconColor: "#4AE54A",
    iconBg: "rgba(74,229,74,0.12)",
    title: "Gestão de Veículos",
    description:
      "Cadastro completo com FIPE integrada, fotos, status e geração de anúncios prontos para OLX e Webmotors.",
  },
  {
    icon: UsersIcon,
    iconColor: "#4AE54A",
    iconBg: "rgba(74,229,74,0.12)",
    title: "Controle de Leads",
    description:
      "Pipeline Kanban visual, histórico de atendimento, WhatsApp integrado e importação via CSV.",
  },
  {
    icon: BarChart3Icon,
    iconColor: "#4AE54A",
    iconBg: "rgba(74,229,74,0.12)",
    title: "Relatórios e Métricas",
    description:
      "Dashboard com KPIs em tempo real: leads, negociações, conversão e valor fechado.",
  },
  {
    icon: CalendarIcon,
    iconColor: "#4AE54A",
    iconBg: "rgba(74,229,74,0.12)",
    title: "Agenda de Eventos",
    description:
      "Calendário de follow-ups, tarefas com prazos e notificações para não perder nenhum timing.",
  },
];

const steps = [
  {
    number: "01",
    title: "Cadastre seus veículos",
    description:
      "Importe pelo FIPE, adicione fotos e gere anúncios prontos em segundos. Estoque organizado desde o primeiro dia.",
  },
  {
    number: "02",
    title: "Gerencie seus leads",
    description:
      "Receba, organize e acompanhe cada cliente no pipeline. WhatsApp integrado com templates e histórico completo.",
  },
  {
    number: "03",
    title: "Feche mais vendas",
    description:
      "Agende follow-ups, envie propostas em PDF e acompanhe métricas reais de conversão no dashboard.",
  },
];

const highlights = [
  {
    icon: ZapIcon,
    color: "#4AE54A",
    title: "Setup em 10 minutos",
    description: "Comece a usar sem treinamento ou configurações complexas.",
  },
  {
    icon: ShieldIcon,
    color: "#4AE54A",
    title: "Dados seguros",
    description: "Isolamento por empresa, RLS no banco e backup automático.",
  },
  {
    icon: TrendingUpIcon,
    color: "#4AE54A",
    title: "Escalável",
    description: "Do vendedor solo à equipe de 10 pessoas sem mudar de sistema.",
  },
  {
    icon: MessageCircleIcon,
    color: "#4AE54A",
    title: "Suporte ativo",
    description:
      "Equipe brasileira, rápida e que conhece o mercado de revendas.",
  },
];

const benefits = [
  { feature: "Pipeline Kanban visual", motorgestor: true, planilha: false, outros: false },
  { feature: "Gestão de veículos", motorgestor: true, planilha: true, outros: true },
  { feature: "FIPE integrada", motorgestor: true, planilha: false, outros: false },
  { feature: "WhatsApp + histórico", motorgestor: true, planilha: false, outros: false },
  { feature: "Importação CSV de leads", motorgestor: true, planilha: false, outros: false },
  { feature: "Gerador de anúncios", motorgestor: true, planilha: false, outros: false },
  { feature: "Proposta em PDF", motorgestor: true, planilha: false, outros: false },
  { feature: "Dashboard de métricas", motorgestor: true, planilha: false, outros: true },
];

const testimonials = [
  {
    quote:
      "Em 2 semanas, a equipe parou de perder lead no histórico. O funil deixou tudo previsível.",
    name: "Marina Almeida",
    role: "Gestora",
    company: "Revenda Compacta",
  },
  {
    quote:
      "A FIPE e o pipeline tiraram a bagunça do atendimento. Hoje sei exatamente quem responder agora.",
    name: "Rafael Souza",
    role: "Vendedor Autônomo",
    company: "RS Veículos",
  },
  {
    quote:
      "As métricas do dashboard viraram rotina. É o tipo de visibilidade que antes só existia em planilha gigante.",
    name: "Diego Pereira",
    role: "Sócio",
    company: "Loja de Seminovos",
  },
];

const faqs = [
  {
    question: "O MotorGestor funciona para qualquer tipo de revenda?",
    answer:
      "Sim! Funciona para revendas pequenas, vendedores autônomos e equipes enxutas. Qualquer negócio que vende carros e precisa organizar atendimento e estoque vai se beneficiar.",
  },
  {
    question: "Preciso de cartão de crédito para começar?",
    answer:
      "Não. O plano Free é totalmente gratuito e você pode começar sem cartão. Só precisará de pagamento se decidir fazer upgrade para o Pro.",
  },
  {
    question: "Quanto tempo leva para configurar?",
    answer:
      "O setup básico leva entre 10 e 20 minutos. Você cadastra seus primeiros veículos e começa a usar o pipeline no mesmo dia.",
  },
  {
    question: "O MotorGestor tem app para celular?",
    answer:
      "O sistema é totalmente responsivo e funciona perfeitamente no celular via navegador. Não há necessidade de instalar nada.",
  },
  {
    question: "Como funciona a integração com WhatsApp?",
    answer:
      "O MotorGestor fornece templates de mensagem para cada etapa do pipeline (primeiro contato, follow-up, proposta). Com 1 clique você abre a conversa no WhatsApp com a mensagem já pronta. O histórico fica registrado na timeline do lead.",
  },
];

// ─── Hero sub-components (inline) ────────────────────────────────────────────

function SparklineMini() {
  return (
    <svg viewBox="0 0 80 30" className="h-8 w-full">
      <path
        d="M0,24 C10,22 14,10 24,12 C32,14 32,22 42,18 C52,14 56,6 66,9 C72,11 74,20 80,14"
        fill="none"
        stroke="#4AE54A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FloatCard({
  label,
  value,
  sub,
  green = false,
}: {
  label: string;
  value: string;
  sub?: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#1A2E23] border border-[rgba(74,229,74,0.2)] px-4 py-3 shadow-2xl shadow-black/40 min-w-[152px]">
      <div className="text-[11px] text-[#9CA3AF] mb-1">{label}</div>
      <div
        className="text-xl font-bold"
        style={{ color: green ? "#4AE54A" : "#fff" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs text-[#4AE54A] mt-0.5 font-medium">{sub}</div>
      )}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[230px] sm:w-[270px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-[2.75rem] bg-[#4AE54A]/15 blur-3xl scale-125 pointer-events-none" />
      {/* Phone shell */}
      <div className="relative rounded-[2.75rem] border-2 border-[rgba(74,229,74,0.25)] bg-[#0D1F1A] p-2.5 shadow-2xl">
        {/* Notch */}
        <div className="flex justify-center mb-2">
          <div className="h-1.5 w-16 rounded-full bg-[#1A2E23]" />
        </div>
        {/* Screen */}
        <div className="rounded-[2rem] overflow-hidden bg-[#111F16]">
          {/* Status bar */}
          <div className="px-4 py-2.5 bg-[#1A2E23] flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#4AE54A] tracking-wide">
              MotorGestor
            </span>
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[rgba(74,229,74,0.6)] animate-pulse" />
              <span className="text-[8px] text-[#9CA3AF]">online</span>
            </div>
          </div>
          {/* Dashboard preview */}
          <div className="p-3 space-y-2.5">
            {/* KPI strip */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                ["Leads", "128"],
                ["Negoc.", "19"],
                ["Fechados", "7"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="bg-[#1A2E23] rounded-xl p-2 border border-[rgba(74,229,74,0.1)]"
                >
                  <div className="text-[7px] text-[#9CA3AF]">{l}</div>
                  <div className="text-xs font-bold text-white">{v}</div>
                </div>
              ))}
            </div>
            {/* Pipeline mini */}
            <div className="bg-[#1A2E23] rounded-xl p-2.5 border border-[rgba(74,229,74,0.1)]">
              <div className="text-[7px] text-[#9CA3AF] mb-2 font-medium">
                Pipeline
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {["Novo", "Proposta", "Fechado"].map((s) => (
                  <div key={s}>
                    <div className="text-[6px] text-[#9CA3AF] mb-1">{s}</div>
                    <div className="space-y-1">
                      <div className="h-4 rounded-md bg-[rgba(74,229,74,0.15)] border border-[rgba(74,229,74,0.12)]" />
                      <div className="h-4 rounded-md bg-[rgba(74,229,74,0.07)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Sparkline */}
            <div className="bg-[#1A2E23] rounded-xl p-2.5 border border-[rgba(74,229,74,0.1)]">
              <div className="text-[7px] text-[#9CA3AF] mb-1 font-medium">
                Evolução mensal
              </div>
              <SparklineMini />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0D1F1A] pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Parallax video background (client) */}
        <div className="absolute inset-0 z-0">
          <HeroBackground />
        </div>

        {/* Dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0D1F1A]/90 via-[#0D1F1A]/75 to-[#0D1F1A]/90" />

        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(74,229,74,0.18),transparent)]" />
        {/* Dot pattern */}
        <div className="z-20 absolute inset-0"><DotPattern /></div>
        {/* Decorative blobs */}
        <GreenBlob className="top-0 right-0 z-20" />
        <GreenBlob className="-bottom-16 -left-16 z-20 opacity-60" />

        {/* Fallback/secondary bg image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-10"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        </div>

        <Container className="relative z-30 max-w-5xl">
          <HeroTextMotion>
          {/* Badge */}
          <FadeUp className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.35)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm text-[#4AE54A] font-semibold">
              <span className="size-1.5 rounded-full bg-[#4AE54A] animate-pulse" />
              Usado por +50 mil usuários no Brasil
            </div>
          </FadeUp>

          {/* Headline */}
          <FadeUp delay={0.08} className="text-center mb-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Solução Completa para
              <br />
              <span className="text-[#4AE54A]">Gestão de Concessionárias</span>
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={0.14} className="text-center mb-9">
            <p className="text-[#9CA3AF] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Pipeline, WhatsApp, FIPE e métricas em um só sistema. Responda
              leads mais rápido e feche mais carros — sem planilhas.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.2} className="flex flex-col sm:flex-row gap-3 justify-center mb-14 sm:mb-20">
            <Button
              asChild
              size="lg"
              className="bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold text-base px-9 shadow-[0_0_28px_rgba(74,229,74,0.35)] transition-all hover:-translate-y-0.5"
            >
              <Link href="/cadastro">
                Começar Grátis <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 text-base px-9"
            >
              <Link href="#como-funciona">Ver Demo</Link>
            </Button>
          </FadeUp>

          {/* Phone + floating cards */}
          <FadeUp delay={0.26}>
            <div className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px]">
              {/* Left floating cards */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 -translate-x-6">
                <FloatCard
                  label="Veículos Ativos"
                  value="1.478"
                  sub="↑ +12% este mês"
                />
                <FloatCard
                  label="Taxa de Conversão"
                  value="23.4%"
                  sub="↑ +5.2pp"
                  green
                />
              </div>

              {/* Central phone */}
              <PhoneMockup />

              {/* Right floating card */}
              <div className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 hidden lg:block">
                <div className="rounded-2xl bg-[#1A2E23] border border-[rgba(74,229,74,0.2)] px-4 py-3 shadow-2xl shadow-black/40 min-w-[152px]">
                  <div className="text-[11px] text-[#9CA3AF] mb-1">
                    Leads Ativos
                  </div>
                  <div className="text-xl font-bold text-white mb-2">500+</div>
                  <SparklineMini />
                </div>
              </div>
            </div>
          </FadeUp>
          </HeroTextMotion>
        </Container>
      </section>

      <SectionDivider />

      {/* ══ 2. PARCEIROS / LOGOS ══════════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100 py-10">
        <Container>
          <FadeUp>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-7">
              Integrado com as ferramentas que você já usa
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              {["WhatsApp", "Google", "Stripe", "OLX", "Webmotors", "FIPE"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="text-base font-bold text-gray-300 tracking-tight select-none"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ══ 2b. STATS ════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D1F1A] py-14 relative overflow-hidden">
        <DotPattern />
        <GreenBlob className="top-0 right-0" />
        <Container className="relative max-w-4xl">
          <FadeUp>
            <AnimatedStats />
          </FadeUp>
        </Container>
      </section>

      <SectionDivider />

      {/* ══ 3. COMO FUNCIONA ══════════════════════════════════════════════════ */}
      <section
        id="como-funciona"
        className="bg-[#0D1F1A] py-20 sm:py-28 scroll-mt-16 relative overflow-hidden"
      >
        <DotPattern />
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-[#4AE54A]/10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full border border-[#4AE54A]/15 pointer-events-none" />
        <Container className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: app window + person photo */}
            <FadeUp>
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#4AE54A]/30 shadow-[0_0_40px_rgba(74,229,74,0.1)]">
                  <div className="rounded-3xl bg-[#0D1F1A] p-6 shadow-2xl shadow-black/20">
                    <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-[#4AE54A]/10 to-transparent blur-xl pointer-events-none" />
                    <DashboardMockup />
                  </div>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"
                    alt="Concessionária moderna"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1F1A]/80 via-[#4AE54A]/10 to-transparent" />
                </div>
              </div>
            </FadeUp>

            {/* Right: steps */}
            <div>
              <FadeUp>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#22C55E] mb-5">
                  Passo a Passo
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  Como o MotorGestor funciona
                </h2>
                <p className="text-[#6B9E6B] mb-10 text-lg">
                  Setup simples, rotina clara. Você organiza estoque e
                  atendimento no mesmo dia.
                </p>
              </FadeUp>

              <div className="space-y-7">
                {steps.map((step, i) => (
                  <FadeUp key={step.number} delay={i * 0.1}>
                    <div className="flex gap-5">
                      <div className="shrink-0 size-12 rounded-2xl bg-[#4AE54A] text-black flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-[#6B9E6B] text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={0.32} className="mt-10">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold"
                >
                  <Link href="/cadastro">
                    Começar agora <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </FadeUp>
            </div>
          </div>
        </Container>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4AE54A]/30 to-transparent" />

      {/* ══ 4. FEATURES GRID (2×2) ════════════════════════════════════════════ */}
      <section className="bg-[#0A1A0C] py-20 sm:py-28 relative overflow-hidden">
        <DotPattern />
        <Container className="relative max-w-6xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que sua revenda precisa
            </h2>
            <p className="text-[#6B9E6B] max-w-xl mx-auto text-lg">
              Uma stack completa de vendas, do estoque ao fechamento, em um só
              lugar.
            </p>
          </FadeUp>

          <FadeUp className="mb-8">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"
                alt="Veículos concessionária"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1A]/90 to-[#0D1F1A]/40" />
              <div className="absolute inset-0 flex items-center px-10">
                <p className="text-white font-goldman text-2xl font-bold max-w-xs">
                  Uma equipe mais rápida, uma revenda mais lucrativa.
                </p>
              </div>
            </div>
          </FadeUp>

          <StaggerSection className="grid sm:grid-cols-2 gap-5">
            {features4.map((f) => (
              <StaggerItem key={f.title}>
                <div className="group bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6 hover:border-[#4AE54A]/40 hover:shadow-[0_0_30px_rgba(74,229,74,0.08)] hover:-translate-y-1 transition-all duration-300 h-full">
                  <div
                    className="size-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: f.iconBg }}
                  >
                    <f.icon className="size-6" style={{ color: f.iconColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[#6B9E6B] text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4AE54A]/30 to-transparent" />

      {/* ══ 5. APP EM DESTAQUE ════════════════════════════════════════════════ */}
      <section className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden">
        <DotPattern />
        <GreenBlob className="top-0 left-0" />
        <Container className="relative max-w-6xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              O Produto
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Dashboard completo para vender mais
            </h2>
            <p className="text-[#6B9E6B] max-w-xl mx-auto">
              Métricas, pipeline e estoque num lugar só. Sem precisar de
              planilha.
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative rounded-2xl overflow-hidden border border-[#4AE54A]/30 shadow-[0_0_40px_rgba(74,229,74,0.1)]">
                <div className="rounded-3xl bg-[#0D1F1A] p-6 shadow-2xl shadow-black/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 size-48 rounded-full bg-[#4AE54A]/6 blur-3xl pointer-events-none" />
                  <DashboardMockup />
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <FadeUp key={h.title} delay={i * 0.08}>
                  <div className="group bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-5 hover:border-[#4AE54A]/40 hover:shadow-[0_0_30px_rgba(74,229,74,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div
                      className="size-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: "rgba(74,229,74,0.12)" }}
                    >
                      <h.icon className="size-5 text-[#4AE54A]" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1.5">
                      {h.title}
                    </h3>
                    <p className="text-[#6B9E6B] text-xs leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 6. PLANOS / BILLING CTA ══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <Container className="max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <FadeUp>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#22C55E] mb-6">
                Planos Simples
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Comece grátis, faça upgrade quando precisar
              </h2>
              <p className="text-gray-500 mb-7 text-lg leading-relaxed">
                Free forever para equipes pequenas. Pro a R$ 79/mês para FIPE,
                WhatsApp avançado e importação CSV.
              </p>
              <ul className="space-y-3 mb-9">
                {[
                  "Sem cartão para começar",
                  "Pipeline e estoque grátis",
                  "Upgrade a qualquer momento",
                  "Suporte em português",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-700 text-sm"
                  >
                    <div className="size-5 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0">
                      <CheckIcon className="size-3 text-[#22C55E]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold"
              >
                <Link href="/cadastro">
                  Criar conta grátis <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </FadeUp>

            {/* Right: styled plan card */}
            <FadeUp delay={0.12}>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D1F1A] via-[#122E1A] to-[#0a1f10] p-8 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 size-56 rounded-full bg-[#4AE54A]/8 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 size-40 rounded-full bg-[#22C55E]/6 blur-2xl pointer-events-none" />
                <div className="relative">
                  {/* Plan header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="text-xs text-[#4AE54A] font-bold mb-2 uppercase tracking-widest">
                        Plano Pro
                      </div>
                      <div className="text-5xl font-bold text-white">
                        R$ 79
                        <span className="text-xl font-normal text-[#9CA3AF]">
                          /mês
                        </span>
                      </div>
                    </div>
                    <div className="size-12 rounded-2xl bg-[#4AE54A] flex items-center justify-center">
                      <WalletIcon className="size-6 text-[#0D1F1A]" />
                    </div>
                  </div>
                  {/* Feature list */}
                  <div className="space-y-3.5">
                    {[
                      "FIPE integrada",
                      "WhatsApp + histórico",
                      "Gerador de anúncios",
                      "Importação CSV",
                      "Dashboard completo",
                    ].map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="size-5 rounded-full bg-[rgba(74,229,74,0.2)] border border-[rgba(74,229,74,0.3)] flex items-center justify-center shrink-0">
                          <CheckIcon className="size-3 text-[#4AE54A]" />
                        </div>
                        <span className="text-white/80 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  {/* Decorative progress bar */}
                  <div className="mt-8 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1 rounded-full flex-1"
                        style={{
                          background:
                            i < 4
                              ? "#4AE54A"
                              : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* ══ 7. COMPARATIVO ════════════════════════════════════════════════════ */}
      <section className="bg-[#0A1A0C] py-20 sm:py-28 relative overflow-hidden">
        <DotPattern />
        <Container className="relative max-w-5xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              Por que escolher
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              MotorGestor vs. alternativas
            </h2>
            <p className="text-[#6B9E6B] max-w-lg mx-auto">
              Feito especificamente para revendas brasileiras — não é um CRM
              genérico adaptado.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="overflow-x-auto rounded-2xl border border-[#4AE54A]/20 bg-[#0F2014]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#4AE54A] border-b border-[#4AE54A]/20">
                    <th className="text-left py-4 px-6 font-semibold text-black">
                      Funcionalidade
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-black">
                      MotorGestor
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-black/60">
                      Planilha
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-black/60">
                      Outros CRMs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? "bg-[#0F2014]" : "bg-[#0D1F1A]"}
                    >
                      <td className="py-3.5 px-6 text-white">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <CheckIcon className="size-5 text-[#4AE54A] mx-auto" />
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.planilha ? (
                          <CheckIcon className="size-5 text-[#6B9E6B] mx-auto" />
                        ) : (
                          <span className="text-red-400 text-lg font-bold">✗</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.outros ? (
                          <CheckIcon className="size-5 text-[#6B9E6B] mx-auto" />
                        ) : (
                          <span className="text-red-400 text-lg font-bold">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </Container>
      </section>

      <SectionDivider />

      {/* ══ 8. TESTIMONIALS (dark) ════════════════════════════════════════════ */}
      <section className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden">
        <DotPattern />
        <GreenBlob className="top-0 right-0" />
        <GreenBlob className="bottom-0 left-0 opacity-50" />
        <Container className="max-w-5xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              Depoimentos
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              O que dizem sobre nós
            </h2>
            <p className="text-[#9CA3AF] max-w-lg mx-auto">
              Revendas e vendedores que já organizam sua operação com o
              MotorGestor.
            </p>
          </FadeUp>

          {/* Featured */}
          <FadeUp delay={0.1}>
            <div className="bg-[#1A2E23] border border-[rgba(74,229,74,0.15)] rounded-2xl p-8 mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 size-64 rounded-full bg-[#4AE54A]/5 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <div className="size-14 rounded-2xl overflow-hidden border border-[rgba(74,229,74,0.2)] shrink-0 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                    alt={testimonials[0].name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                  />
                </div>
                <div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="size-4 text-[#4AE54A] fill-[#4AE54A]"
                      />
                    ))}
                  </div>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    &ldquo;{testimonials[0].quote}&rdquo;
                  </p>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonials[0].name}
                    </div>
                    <div className="text-[#9CA3AF] text-sm">
                      {testimonials[0].role} · {testimonials[0].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Secondary cards */}
          <StaggerSection className="grid sm:grid-cols-2 gap-5">
            {testimonials.slice(1).map((t) => (
              <StaggerItem key={t.name}>
                <div className="bg-[#1A2E23] border border-[rgba(74,229,74,0.1)] rounded-2xl p-6 hover:border-[rgba(74,229,74,0.2)] transition-colors h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl bg-[#0D1F1A] border border-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#4AE54A]">
                        {t.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {t.name}
                      </div>
                      <div className="text-[#9CA3AF] text-xs truncate">
                        {t.role} · {t.company}
                      </div>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon
                          key={j}
                          className="size-3 text-[#4AE54A] fill-[#4AE54A]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </Container>
      </section>

      {/* ══ 9. FAQ ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden">
        <DotPattern />
        <Container className="relative max-w-3xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-[#6B9E6B]">Dúvidas comuns sobre o MotorGestor.</p>
          </FadeUp>

          <FaqSection faqs={faqs} />
        </Container>
      </section>

      <SectionDivider />

      {/* ══ 10. CTA FINAL (dark) ═════════════════════════════════════════════ */}
      <section
        className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(rgba(74,229,74,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgba(74,229,74,0.10),transparent)]" />
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-[#4AE54A]/10 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full border border-[#4AE54A]/15 pointer-events-none" />
        <Container className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Comece a Gerenciar Sua
                Concessionária de Forma{" "}
                <span className="text-[#4AE54A]">Inteligente</span>
              </h2>
              <p className="text-[#9CA3AF] mb-8 text-lg leading-relaxed">
                Sem cartão de crédito. Configure em minutos e veja a diferença
                no primeiro dia de uso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-bold text-base px-9 shadow-[0_0_28px_rgba(74,229,74,0.35)] transition-all hover:-translate-y-0.5"
                >
                  <Link href="/cadastro">
                    Criar conta grátis{" "}
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/login">Já tenho conta</Link>
                </Button>
              </div>
              <p className="text-[#9CA3AF]/50 text-xs">
                Sem cartão para começar · Setup em 10 minutos · Suporte em
                português
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="rounded-3xl bg-[#111F16] border border-[rgba(74,229,74,0.12)] p-5 shadow-2xl">
                <DashboardMockup />
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}
