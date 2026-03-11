import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  CalendarIcon,
  CheckIcon,
  FileUpIcon,
  FileTextIcon,
  ImageIcon,
  MessageCircleIcon,
  SparklesIcon,
  TriangleAlertIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";

import { Container } from "@/components/site/container";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import {
  AgendaScreenshot,
  LeadTimelineScreenshot,
  PipelineScreenshot,
} from "@/components/site/product-screenshots";
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
    icon: CalendarIcon,
    title: "Agenda de follow-ups",
    description: "Calendário mensal + tarefas atrasadas e próximas com 1 clique.",
    mockup: MetricsMiniMockup,
  },
  {
    icon: MessageCircleIcon,
    title: "WhatsApp integrado",
    description: "Modelos prontos + copiar mensagem + histórico na timeline do lead.",
    mockup: AiMiniMockup,
  },
  {
    icon: WalletIcon,
    title: "FIPE integrada",
    description: "Busque o valor de referência e padronize seu cadastro de veículos.",
    mockup: FipeMiniMockup,
  },
  {
    icon: FileTextIcon,
    title: "Fotos e proposta PDF",
    description: "Upload de fotos do veículo e proposta pronta para salvar em PDF.",
    mockup: MetricsMiniMockup,
  },
  {
    icon: ImageIcon,
    title: "Gerador de anúncios (OLX/Webmotors)",
    description: "Gere anúncio pronto para copiar, com fotos e botão de “melhorar com IA”.",
    mockup: PipelineMiniMockup,
  },
  {
    icon: FileUpIcon,
    title: "Importação de leads (CSV)",
    description: "Upload, mapeamento de colunas e importação em lote com validação.",
    mockup: MetricsMiniMockup,
  },
  {
    icon: BotIcon,
    title: "IA opcional",
    description: "Descrição de veículo e mensagens com `AI_PROVIDER=mock` ou OpenAI.",
    mockup: AiMiniMockup,
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
                Organize seus leads e vendas de veículos em um único sistema.
              </h1>

              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                CRM automotivo com pipeline, FIPE automática, WhatsApp integrado e gestão completa
                de anúncios.
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
                  <Link href="#screens">Ver demonstração</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Importe sua base", "CSV com mapeamento."],
                  ["WhatsApp com histórico", "Fica tudo registrado."],
                  ["Anúncios prontos", "OLX e Webmotors."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="screens" className="scroll-mt-24">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(800px_circle_at_0%_0%,rgba(16,185,129,.10),transparent_60%),radial-gradient(800px_circle_at_100%_20%,rgba(59,130,246,.10),transparent_60%)]" />
                <DashboardMockup />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {["Dashboard real do produto", "Pipeline", "Timeline + WhatsApp", "Agenda de tarefas"].map(
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
                Problemas
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Problemas que o MotorGestor resolve
              </h2>
              <p className="text-muted-foreground">
                Quando o atendimento e o estoque ficam espalhados, a conversão cai. O MotorGestor
                organiza rotina e histórico para você saber o que fazer agora.
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              {[
                ["Leads perdidos no WhatsApp", "Sem histórico, sem templates e sem acompanhamento."],
                ["Controle ruim de veículos", "Cadastro inconsistente, fotos espalhadas e pouco contexto."],
                ["Anúncios espalhados em vários sites", "OLX/Webmotors com textos e fotos repetidos manualmente."],
                ["Falta de acompanhamento de clientes", "Sem tarefas, agenda e próximos passos claros."],
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
                      ["WhatsApp integrado", "Templates + histórico no lead."],
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
                Uma stack de vendas completa para revendas pequenas.
              </h2>
              <p className="text-muted-foreground">
                Pipeline, follow-ups, WhatsApp, FIPE, fotos e anúncios. Tudo no mesmo lugar.
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

      {/* SECTION 4 — Screenshots */}
      <section className="border-y bg-muted/30 py-18 sm:py-24">
        <Container className="max-w-7xl">
          <div className="grid gap-10">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <div className="space-y-3 lg:col-span-6">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Screenshots
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Veja o produto em ação.
                </h2>
                <p className="text-muted-foreground">
                  Dashboard, Pipeline, Timeline do lead e Agenda: o essencial para vender com rotina.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end">
                <Button asChild size="lg">
                  <Link href="/cadastro">
                    Começar grátis <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Entrar</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                <div className="space-y-2 lg:col-span-5">
                  <div className="text-sm font-medium">Pipeline (Kanban)</div>
                  <div className="text-sm text-muted-foreground">
                    Arraste leads entre etapas e mantenha o funil sempre atualizado.
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <PipelineScreenshot />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                <div className="space-y-2 lg:col-span-5">
                  <div className="text-sm font-medium">Dashboard</div>
                  <div className="text-sm text-muted-foreground">
                    Métricas reais de leads e valor negociado/fechado — sem planilha.
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <DashboardMockup />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                <div className="space-y-2 lg:col-span-5">
                  <div className="text-sm font-medium">Timeline do lead</div>
                  <div className="text-sm text-muted-foreground">
                    Histórico de atendimento (comentários, status e WhatsApp) com data e contexto.
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <LeadTimelineScreenshot />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                <div className="space-y-2 lg:col-span-5">
                  <div className="text-sm font-medium">Agenda de follow-ups</div>
                  <div className="text-sm text-muted-foreground">
                    Vencimentos no calendário + listas de atrasadas e próximas tarefas.
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <AgendaScreenshot />
                </div>
              </div>
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
                  Planos
                </div>
                <h3 className="text-balance text-2xl font-semibold tracking-tight">
                  Plano Free e Pro.
                </h3>
                <p className="text-muted-foreground">
                  Comece no Free e faça upgrade quando sua operação crescer.
                </p>
              </div>
              <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
                {[
                  {
                    name: "Free",
                    price: "R$ 0",
                    desc: "Para testar a rotina e organizar os primeiros leads.",
                    items: ["Pipeline", "Cadastro de veículos", "Agenda de follow-ups", "Proposta PDF"],
                    cta: "Começar grátis",
                    variant: "outline" as const,
                  },
                  {
                    name: "Pro",
                    price: "R$ 79/mês",
                    desc: "Para operar todos os dias com velocidade e padrão.",
                    items: ["FIPE integrada", "WhatsApp + histórico", "Gerador de anúncios", "Importação CSV"],
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
                    Coloque pipeline, follow-ups e WhatsApp no centro da operação. Menos improviso, mais previsibilidade.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:justify-self-end">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/cadastro">
                      Criar conta grátis <ArrowRightIcon className="ml-2 size-4" />
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

