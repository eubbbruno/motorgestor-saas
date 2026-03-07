import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  CheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";

import { Container } from "@/components/site/container";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import {
  AiMiniMockup,
  FipeMiniMockup,
  MetricsMiniMockup,
  PipelineMiniMockup,
} from "@/components/site/mini-mockups";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BarChart3Icon,
    title: "Pipeline visual (Kanban)",
    description: "Arraste leads entre etapas e veja o funil evoluir em tempo real.",
    mockup: PipelineMiniMockup,
  },
  {
    icon: WalletIcon,
    title: "FIPE integrada",
    description: "Busque o valor de referência e padronize seu cadastro de veículos.",
    mockup: FipeMiniMockup,
  },
  {
    icon: BotIcon,
    title: "IA para mensagens",
    description: "Gere textos de WhatsApp e descrições de anúncio com 1 clique (mock/OpenAI).",
    mockup: AiMiniMockup,
  },
  {
    icon: TrendingUpIcon,
    title: "Métricas em tempo real",
    description: "Conversão, valor em negociação, fechados e ticket médio — sem planilha.",
    mockup: MetricsMiniMockup,
  },
];

const testimonials = [
  {
    quote:
      "Em 2 semanas, a equipe parou de “perder lead no histórico”. O funil deixou tudo previsível.",
    name: "Marina Almeida",
    role: "Gestora • Revenda Compacta",
  },
  {
    quote:
      "A FIPE e o pipeline tiraram a bagunça do atendimento. Hoje eu sei exatamente quem responder agora.",
    name: "Rafael Souza",
    role: "Vendedor Autônomo",
  },
  {
    quote:
      "As métricas do dashboard viraram rotina. É o tipo de visibilidade que antes só existia em planilha gigante.",
    name: "Diego Pereira",
    role: "Sócio • Loja de Seminovos",
  },
];

export default function HomePage() {
  return (
    <>
      {/* SECTION 1 — white */}
      <section className="bg-background py-18 sm:py-24">
        <Container className="max-w-7xl">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6 pt-2">
              <Badge variant="secondary" className="border bg-background">
                SaaS B2B para revendas e vendedores autônomos
              </Badge>

              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                Gerencie vendas de veículos com mais organização e menos planilhas.
              </h1>

              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                Um sistema simples para pipeline, FIPE e comunicação por WhatsApp — com
                métricas que mostram o que fazer agora para fechar mais.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="shadow-sm ring-1 ring-foreground/10 transition hover:-translate-y-0.5"
                >
                  <Link href="/cadastro">
                    Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#demo">Ver demonstração</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Setup em minutos", "Crie conta e comece."],
                  ["FIPE automática", "Padronize valor."],
                  ["Funil claro", "Controle de etapas."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="demo" className="scroll-mt-24">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(800px_circle_at_0%_0%,rgba(16,185,129,.10),transparent_60%),radial-gradient(800px_circle_at_100%_20%,rgba(59,130,246,.10),transparent_60%)]" />
                <DashboardMockup />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {["Pipeline + Dashboard", "Evolução mensal", "Valor fechado por mês", "RLS (multi-tenant)"].map(
                  (t) => (
                    <span key={t} className="rounded-full border bg-background px-3 py-1">
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2 — subtle background */}
      <section className="border-y bg-muted/30 py-18 sm:py-24">
        <Container className="max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="space-y-4 lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Problema → solução
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                O que trava a venda no dia a dia.
              </h2>
              <p className="text-muted-foreground">
                Três pontos comuns que derrubam conversão em revendas pequenas — e como o
                MotorGestor resolve de forma objetiva.
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-3">
              {[
                ["Leads perdidos no WhatsApp", "Sem histórico e sem próximo passo."],
                ["Preço de veículos confuso", "Sem FIPE e sem padrão de cadastro."],
                ["Falta de controle do funil", "Sem etapas e sem visão de conversão."],
              ].map(([title, desc]) => (
                <Card key={title} className="rounded-xl bg-background p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg border bg-background p-2">
                      <XIcon className="size-4 text-destructive" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{title}</div>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-12">
              <Card className="rounded-xl bg-background p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="space-y-2 lg:col-span-5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <TriangleAlertIcon className="size-4 text-muted-foreground" />
                      <span>Se você já vende, mas sente “bagunça”, é aqui que melhora.</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      MotorGestor resolve com um conjunto pequeno de ferramentas que você usa todo dia.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
                    {[
                      ["Pipeline visual", "Etapas claras + arrastar e soltar."],
                      ["FIPE automática", "Valor de referência no cadastro."],
                      ["IA para mensagens", "Resposta rápida com padrão."],
                    ].map(([t, d]) => (
                      <div key={t} className="rounded-xl border bg-background p-4">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="size-4 text-emerald-500" />
                          <div className="text-sm font-medium">{t}</div>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 3 — white */}
      <section className="bg-background py-18 sm:py-24">
        <Container className="max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="space-y-4 lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Features
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Quatro peças que mudam sua rotina.
              </h2>
              <p className="text-muted-foreground">
                Visual, direto e feito para o dia a dia de uma operação enxuta.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/cadastro">
                    Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/precos">Ver planos</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              {features.map((f) => (
                <Card
                  key={f.title}
                  className="rounded-xl bg-background p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <f.icon className="size-4 text-muted-foreground" />
                        <div className="font-medium">{f.title}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </div>
                    <SparklesIcon className="size-4 text-muted-foreground/60" />
                  </div>
                  <div className="mt-4">
                    <f.mockup />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 4 — subtle gradient */}
      <section className="relative overflow-hidden py-18 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(59,130,246,.10),transparent_55%),radial-gradient(900px_circle_at_0%_40%,rgba(16,185,129,.10),transparent_55%)]" />
        <Container className="max-w-7xl">
          <div className="grid gap-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="space-y-3 lg:col-span-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Social proof
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Um padrão de operação que escala com o time.
                </h2>
                <p className="text-muted-foreground">
                  Depoimentos mock por enquanto — mas no estilo de SaaS premium: objetivo, elegante e focado em resultado.
                </p>
              </div>
              <div className="grid gap-4 lg:col-span-7 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <Card key={t.name} className="rounded-xl bg-background/60 p-6 shadow-sm backdrop-blur">
                    <div className="text-sm leading-relaxed text-foreground/90">“{t.quote}”</div>
                    <div className="mt-4">
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="space-y-3 lg:col-span-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Planos (preview)
                </div>
                <h3 className="text-balance text-2xl font-semibold tracking-tight">
                  Comece simples. Evolua quando precisar.
                </h3>
                <p className="text-muted-foreground">
                  Placeholder por enquanto — estrutura pronta para você evoluir depois com billing.
                </p>
              </div>
              <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
                {[
                  {
                    name: "Free",
                    price: "R$ 0",
                    desc: "Para testar a rotina e organizar os primeiros leads.",
                    items: ["Pipeline básico", "Cadastro de veículos", "Agenda simples", "Métricas essenciais"],
                    cta: "Começar grátis",
                    variant: "outline" as const,
                  },
                  {
                    name: "Pro",
                    price: "R$ 79/mês",
                    desc: "Para operar todos os dias com velocidade e padrão.",
                    items: ["FIPE integrada", "IA para mensagens", "Relatórios", "Suporte prioritário"],
                    cta: "Assinar Pro",
                    variant: "default" as const,
                  },
                ].map((p) => (
                  <Card
                    key={p.name}
                    className="rounded-xl border bg-background/60 p-6 shadow-sm backdrop-blur"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight">{p.price}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{p.desc}</div>
                      </div>
                      <div className="h-9 w-9 rounded-xl border bg-background/70" />
                    </div>
                    <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      {p.items.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button asChild size="lg" variant={p.variant} className="w-full">
                        <Link href="/cadastro">
                          {p.cta} <ArrowRightIcon className="ml-2 size-4" />
                        </Link>
                      </Button>
                      <div className="mt-3 text-center text-xs text-muted-foreground">
                        Placeholder • ajuste valores depois
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="relative overflow-hidden rounded-xl border bg-background/60 p-10 shadow-sm backdrop-blur">
              <div className="pointer-events-none absolute -left-28 -top-28 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-28 -bottom-28 size-96 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-8">
                  <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                    Comece a organizar suas vendas hoje.
                  </h3>
                  <p className="text-muted-foreground">
                    Coloque pipeline e dados no centro da operação. Menos improviso, mais previsibilidade.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:justify-self-end">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/cadastro">
                      Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <div className="mt-3 text-center text-xs text-muted-foreground">
                    Sem cartão para começar • Configure em minutos
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}

