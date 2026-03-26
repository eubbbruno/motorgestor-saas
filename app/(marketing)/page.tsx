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
              Grátis para começar
            </div>
          </FadeUp>

          {/* Headline */}
          <FadeUp delay={0.08} className="text-center mb-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Sua concessionária no
              <br />
              <span className="text-[#4AE54A]">controle total</span>
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={0.14} className="text-center mb-9">
            <p className="text-[#9CA3AF] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Gerencie estoque, leads e vendas num só lugar. Sem planilha, sem achismo.
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
      <section className="bg-white py-16 border-y border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-10">
            Integrado com as ferramentas que você já usa
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee gap-16 w-max items-center">
              <img src="/images/logos/whatsapp.png" alt="WhatsApp" className="h-8 w-auto object-contain rounded-lg bg-white p-1" />
              <img src="/images/logos/olx.png" alt="OLX" className="h-8 w-auto object-contain" />
              <img src="/images/logos/webmotors.png" alt="Webmotors" className="h-7 w-auto object-contain" />
              <img src="/images/logos/icarros.svg" alt="iCarros" className="h-7 w-auto object-contain" />
              <img src="/images/logos/fipe.jpg" alt="FIPE" className="h-8 w-auto object-contain" />
              {/* Duplicado para loop seamless */}
              <img src="/images/logos/whatsapp.png" alt="WhatsApp" className="h-8 w-auto object-contain rounded-lg bg-white p-1" />
              <img src="/images/logos/olx.png" alt="OLX" className="h-8 w-auto object-contain" />
              <img src="/images/logos/webmotors.png" alt="Webmotors" className="h-7 w-auto object-contain" />
              <img src="/images/logos/icarros.svg" alt="iCarros" className="h-7 w-auto object-contain" />
              <img src="/images/logos/fipe.jpg" alt="FIPE" className="h-8 w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. COMO FUNCIONA ══════════════════════════════════════════════════ */}
      <section
        id="como-funciona"
        className="bg-[#0D1F1A] py-20 sm:py-28 scroll-mt-16 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,229,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,229,74,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-[#4AE54A]/10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full border border-[#4AE54A]/15 pointer-events-none" />
        <Container className="relative max-w-5xl">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-5">
              Passo a passo
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Do cadastro ao fechamento em minutos
            </h2>
            <p className="text-[#6B9E6B] max-w-xl mx-auto text-lg">
              Setup simples, rotina clara. Organize estoque e atendimento no mesmo dia.
            </p>
          </FadeUp>

          {/* Steps grid */}
          <div className="relative">
            {/* Connecting dashed line — desktop only */}
            <div className="hidden lg:block absolute top-[64px] left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px border-t border-dashed border-[#4AE54A]/25 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6 relative z-10">
              {/* Step 1 */}
              <FadeUp delay={0.0}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-[#4AE54A]/10 animate-pulse" />
                    <div className="absolute inset-4 rounded-full bg-[#4AE54A]/15" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20">
                        <rect x="10" y="35" width="60" height="22" rx="8" fill="#4AE54A" opacity="0.9"/>
                        <rect x="20" y="22" width="38" height="18" rx="6" fill="#4AE54A" opacity="0.7"/>
                        <circle cx="22" cy="57" r="7" fill="#0D1F1A" stroke="#4AE54A" strokeWidth="2"/>
                        <circle cx="58" cy="57" r="7" fill="#0D1F1A" stroke="#4AE54A" strokeWidth="2"/>
                        <path d="M50 28 L56 22 M56 22 L62 28 M56 22 L56 14" stroke="#4AE54A" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4AE54A] text-sm font-semibold">Passo 01</span>
                  <h3 className="text-white font-goldman text-xl">Cadastre seu estoque</h3>
                  <p className="text-[#6B9E6B] text-sm max-w-[200px]">Importe pelo FIPE ou adicione manualmente. Fotos, preço e detalhes prontos.</p>
                </div>
              </FadeUp>

              {/* Step 2 */}
              <FadeUp delay={0.15}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-[#4AE54A]/10 animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute inset-4 rounded-full bg-[#4AE54A]/15" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20">
                        <path d="M10 15 L70 15 L50 40 L50 65 L30 65 L30 40 Z" fill="#4AE54A" opacity="0.2" stroke="#4AE54A" strokeWidth="1.5"/>
                        <circle cx="25" cy="10" r="4" fill="#4AE54A" opacity="0.8"/>
                        <circle cx="40" cy="8" r="4" fill="#4AE54A"/>
                        <circle cx="55" cy="10" r="4" fill="#4AE54A" opacity="0.8"/>
                        <circle cx="40" cy="58" r="6" fill="#4AE54A"/>
                        <path d="M37 55 L40 61 L43 55" fill="#4AE54A"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4AE54A] text-sm font-semibold">Passo 02</span>
                  <h3 className="text-white font-goldman text-xl">Receba e organize leads</h3>
                  <p className="text-[#6B9E6B] text-sm max-w-[200px]">Pipeline Kanban visual com WhatsApp integrado. Nunca mais perca um cliente.</p>
                </div>
              </FadeUp>

              {/* Step 3 */}
              <FadeUp delay={0.3}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-[#4AE54A]/10 animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute inset-4 rounded-full bg-[#4AE54A]/15" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20">
                        <polyline points="10,60 25,45 40,50 55,30 70,15" fill="none" stroke="#4AE54A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="70" cy="15" r="8" fill="#4AE54A" opacity="0.2"/>
                        <path d="M66 15 L69 18 L74 12" stroke="#4AE54A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4AE54A] text-sm font-semibold">Passo 03</span>
                  <h3 className="text-white font-goldman text-xl">Feche mais vendas</h3>
                  <p className="text-[#6B9E6B] text-sm max-w-[200px]">Envie propostas em PDF, acompanhe métricas e veja resultado desde a primeira semana.</p>
                </div>
              </FadeUp>
            </div>
          </div>

          <FadeUp delay={0.4} className="flex justify-center mt-14">
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
        </Container>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4AE54A]/30 to-transparent" />

      {/* ══ 4. FEATURES GRID (2×2) ════════════════════════════════════════════ */}
      <section className="bg-[#0A1A0C] py-20 sm:py-28 relative overflow-hidden">
        <Container className="relative max-w-6xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que sua revenda precisa para crescer
            </h2>
            <p className="text-[#6B9E6B] max-w-xl mx-auto text-lg">
              Do estoque ao fechamento, em um só lugar. Sem complexidade, sem curva de aprendizado.
            </p>
          </FadeUp>

          <FadeUp className="mb-10">
            <div className="relative w-full h-72 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1400&q=80"
                alt="Pátio de concessionária com veículos"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1A]/95 via-[#0D1F1A]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center px-10">
                <div className="max-w-xs">
                  <p className="text-[#4AE54A] text-sm font-semibold mb-2">Gestão completa</p>
                  <p className="text-white font-goldman text-2xl font-bold leading-tight">Do pátio ao fechamento, tudo conectado.</p>
                </div>
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
      <section
        className="py-20 sm:py-28 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,229,74,0.06) 0%, #060F08 70%)" }}
      >
        <Container className="relative max-w-6xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              O Produto
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Visão completa do seu negócio em tempo real
            </h2>
            <p className="text-[#6B9E6B] max-w-xl mx-auto">
              Métricas, pipeline e estoque num lugar só. Sem precisar de planilha.
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
      <section className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(74,229,74,0.06) 0px, rgba(74,229,74,0.06) 1px, transparent 1px, transparent 60px)",
          }} />
        </div>
        <Container className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <FadeUp>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
                Planos Simples
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Comece grátis, faça upgrade quando precisar
              </h2>
              <p className="text-[#6B9E6B] mb-7 text-lg leading-relaxed">
                Plano Free para começar sem cartão. Pro para quem precisa de mais volume, FIPE e WhatsApp avançado.
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
                    className="flex items-center gap-3 text-[#9CA3AF] text-sm"
                  >
                    <div className="size-5 rounded-full bg-[rgba(74,229,74,0.15)] flex items-center justify-center shrink-0">
                      <CheckIcon className="size-3 text-[#4AE54A]" />
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
        <Container className="relative max-w-5xl">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-4">
              Por que escolher
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Por que times de vendas escolhem o MotorGestor
            </h2>
            <p className="text-[#6B9E6B] max-w-lg mx-auto">
              Feito especificamente para revendas brasileiras — não é um CRM genérico adaptado.
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
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "#060F08" }}>
        <Container className="max-w-3xl">
          <FadeUp className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Depoimentos
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              O que dizem sobre nós
            </h2>
            <p className="text-[#6B9E6B] max-w-lg mx-auto mb-12">
              Revendas e vendedores que já organizam sua operação com o MotorGestor.
            </p>
            <div className="rounded-2xl border border-dashed border-[#4AE54A]/20 bg-[#0D1F1A]/60 px-8 py-12 flex flex-col items-center gap-4">
              <div className="size-14 rounded-2xl bg-[rgba(74,229,74,0.08)] border border-[rgba(74,229,74,0.15)] flex items-center justify-center">
                <StarIcon className="size-7 text-[#4AE54A]/50" />
              </div>
              <p className="text-[#6B9E6B] text-base text-center max-w-sm">
                Em breve — depoimentos reais de revendas parceiras.
              </p>
              <p className="text-[#6B9E6B]/50 text-sm text-center">
                Está usando o MotorGestor? <Link href="/contato" className="text-[#4AE54A] hover:underline">Conta pra gente.</Link>
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ══ 9. FAQ ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D1F1A] py-20 sm:py-28 relative overflow-hidden">
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
        className="bg-[#0A1A0C] py-20 sm:py-28 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(74,229,74,0.08),transparent)]" />
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-[#4AE54A]/10 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full border border-[#4AE54A]/15 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-[#4AE54A]/10 pointer-events-none" />
        <Container className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Comece hoje.{" "}
                <span className="text-[#4AE54A]">Veja resultado na primeira semana.</span>
              </h2>
              <p className="text-[#9CA3AF] mb-8 text-lg leading-relaxed">
                Sem cartão de crédito. Configure em minutos e veja a diferença no primeiro dia.
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
