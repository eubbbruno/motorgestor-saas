import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  MessageSquareTextIcon,
  SparklesIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import { Container } from "@/components/site/container";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const problemSolution = [
  {
    icon: MessageSquareTextIcon,
    title: "Leads se perdem no WhatsApp",
    description:
      "Sem um funil claro, o follow-up vira “mais tarde” — e a venda escapa.",
  },
  {
    icon: TrendingUpIcon,
    title: "Sem previsibilidade de vendas",
    description:
      "Quando você não mede etapas, não sabe onde está perdendo oportunidades.",
  },
  {
    icon: SparklesIcon,
    title: "Atendimento sem padrão",
    description:
      "Resposta lenta e mensagens inconsistentes derrubam a taxa de conversão.",
  },
];

const features = [
  {
    icon: BarChart3Icon,
    title: "Pipeline visual (Kanban)",
    description: "Arraste leads entre etapas e veja o funil evoluir em tempo real.",
  },
  {
    icon: WalletIcon,
    title: "FIPE integrada",
    description: "Busque o valor de referência e padronize seu cadastro de veículos.",
  },
  {
    icon: BotIcon,
    title: "IA para mensagens",
    description: "Gere textos de WhatsApp e descrições de anúncio com 1 clique (mock/OpenAI).",
  },
  {
    icon: TrendingUpIcon,
    title: "Métricas em tempo real",
    description: "Conversão, valor em negociação, fechados e ticket médio — sem planilha.",
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
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 size-112 rounded-full bg-blue-500/8 blur-3xl" />
          <div className="absolute -right-40 top-10 size-120 rounded-full bg-emerald-400/8 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-10%,rgba(59,130,246,.10),transparent_55%),radial-gradient(900px_circle_at_0%_30%,rgba(16,185,129,.10),transparent_55%)]" />
        </div>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <Badge variant="secondary" className="border bg-background/60 backdrop-blur">
                SaaS B2B para revendas e vendedores autônomos
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Transforme leads em{" "}
                <span className="text-emerald-300">vendas previsíveis</span> — com
                funil claro, FIPE e métricas em tempo real.
              </h1>
              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                Pare de depender de planilhas e “memória do WhatsApp”. Organize o
                atendimento, padronize cadastros e execute follow-up com rotina —
                do primeiro contato ao fechamento.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  <Link href="/cadastro">
                    Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-background/40 backdrop-blur transition hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-blue-400/50"
                >
                  <Link href="#demo">Ver demonstração</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Setup em minutos
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Multi-empresa com RLS
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Pipeline + FIPE + IA
                </span>
              </div>
            </div>

            <div id="demo" className="scroll-mt-24">
              <DashboardMockup className="lg:scale-[1.02]" />
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Dashboard + Pipeline
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Métricas e evolução mensal
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Visual premium (rounded-xl + shadow leve)
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="space-y-3 lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Problema → solução
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Uma operação simples — sem perder oportunidade no caminho.
              </h2>
              <p className="text-muted-foreground">
                O MotorGestor organiza seu atendimento com um funil claro e dados
                que você confia para decidir o que fazer agora.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-3">
              {problemSolution.map((b) => (
                <Card key={b.title} className="rounded-xl bg-background/60 p-5 shadow-sm">
                  <b.icon className="size-5 text-emerald-300" />
                  <div className="mt-3 font-medium">{b.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="space-y-3 lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recursos principais
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Tudo que você precisa para vender com consistência.
              </h2>
              <p className="text-muted-foreground">
                Pipeline, FIPE, IA e métricas: uma rotina simples que aumenta
                velocidade de resposta e melhora conversão.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/cadastro">
                    Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/recursos">Ver todos os recursos</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              {features.map((f) => (
                <Card
                  key={f.title}
                  className="rounded-xl bg-background/60 p-6 shadow-sm transition hover:shadow-md"
                >
                  <f.icon className="size-5 text-emerald-300" />
                  <div className="mt-3 font-medium">{f.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-8">
            <div className="space-y-2 text-center">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Prova social
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Times pequenos, operação mais inteligente.
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Depoimentos mock (por enquanto) no estilo SaaS premium. O objetivo
                é mostrar o tipo de resultado que o produto entrega.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name} className="rounded-xl bg-background/60 p-6 shadow-sm">
                  <div className="text-sm leading-relaxed text-foreground/90">“{t.quote}”</div>
                  <div className="mt-4">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Card className="relative overflow-hidden rounded-xl border bg-background/50 p-10 shadow-sm backdrop-blur">
            <div className="pointer-events-none absolute -left-28 -top-28 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-28 -bottom-28 size-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-3 lg:col-span-8">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Comece hoje
                </div>
                <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Deixe o funil trabalhar por você — e feche mais vendas.
                </h3>
                <p className="text-muted-foreground">
                  Crie sua conta, cadastre seu estoque e organize seus leads em uma
                  rotina simples. Sem planilha. Sem bagunça.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button
                  asChild
                  size="lg"
                  className="w-full shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30"
                >
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
        </Container>
      </section>
    </>
  );
}

