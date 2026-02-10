import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BarChart3Icon, CalendarIcon, CarIcon, UsersIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    icon: CarIcon,
    title: "Estoque organizado",
    description:
      "Cadastre veículos com fotos, preço, quilometragem e status. Busque e filtre em segundos.",
  },
  {
    icon: UsersIcon,
    title: "Leads com histórico",
    description:
      "De “chegou no WhatsApp” a “venda concluída” com pipeline simples e rastreável.",
  },
  {
    icon: CalendarIcon,
    title: "Agenda que vira resultado",
    description:
      "Agende test-drives, retornos e visitas. Tudo vinculado ao lead e com lembretes.",
  },
  {
    icon: BarChart3Icon,
    title: "Métricas sem complicação",
    description:
      "Visão rápida de estoque, leads do mês e conversão por etapa — sem planilha.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 size-112 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-40 top-10 size-120 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_-10%,rgba(59,130,246,.16),transparent_55%),radial-gradient(700px_circle_at_0%_30%,rgba(16,185,129,.14),transparent_55%)]" />
        </div>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6">
              <Badge variant="secondary" className="border bg-background/60 backdrop-blur">
                SaaS B2B para revendas pequenas
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Gestão de veículos, leads e agenda em um só lugar.{" "}
                <span className="text-emerald-300">Sem planilha.</span>
              </h1>
              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                O MotorGestor ajuda você a organizar estoque, acompanhar leads e
                fechar mais vendas com visibilidade de funil e rotina de
                atendimento.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  <Link href="/cadastro">
                    Criar minha conta <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-background/40 backdrop-blur transition hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-blue-400/50"
                >
                  <Link href="/recursos">Ver recursos</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Multi-empresa (tenant) por concessionária
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Papéis: Admin e Vendedor
                </span>
                <span className="rounded-full border bg-background/70 px-3 py-1">
                  Supabase + RLS (segurança real)
                </span>
              </div>
            </div>

            <Card className="relative overflow-hidden border bg-background/50 p-2 shadow-sm backdrop-blur">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 size-72 rounded-full bg-blue-500/15 blur-3xl" />

              <div className="relative aspect-16/10 overflow-hidden rounded-lg border bg-[radial-gradient(900px_circle_at_20%_0%,rgba(16,185,129,.22),transparent_55%),radial-gradient(900px_circle_at_80%_40%,rgba(59,130,246,.22),transparent_55%)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_70%_40%,rgba(16,185,129,.18),transparent_60%)]" />
                <Image
                  src="/hero-3d.png"
                  alt="Ilustração 3D do MotorGestor"
                  fill
                  className="object-contain p-6 drop-shadow-[0_18px_38px_rgba(0,0,0,0.35)] sm:p-8"
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-background/60 p-3">
                  <div className="text-xs text-muted-foreground">Leads hoje</div>
                  <div className="text-xl font-semibold">12</div>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <div className="text-xs text-muted-foreground">Veículos</div>
                  <div className="text-xl font-semibold">37</div>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <div className="text-xs text-muted-foreground">Conversão</div>
                  <div className="text-xl font-semibold">18%</div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-5">
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Feito para operar rápido — e crescer sem virar bagunça.
              </h2>
              <p className="text-muted-foreground">
                Rotina clara de atendimento, organização do estoque e visibilidade
                do funil com o mínimo de atrito.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              {highlights.map((h) => (
                <Card key={h.title} className="bg-background/60 p-5">
                  <h.icon className="size-5 text-emerald-300" />
                  <div className="mt-3 font-medium">{h.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{h.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Card className="overflow-hidden bg-background/60">
            <div className="grid gap-8 p-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-3">
                <Badge variant="secondary">Fluxo completo</Badge>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Do lead ao fechamento — com histórico e próximos passos.
                </h3>
                <p className="text-muted-foreground">
                  Chega de “me chama amanhã”. Tenha agenda, pipeline e cadastros
                  que realmente ajudam a vender.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/precos">Ver planos</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contato">Falar com a equipe</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 rounded-xl border bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pipeline</span>
                  <span className="font-medium">Hoje</span>
                </div>
                <Separator />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Novos", "8"],
                    ["Contato", "11"],
                    ["Visita/Test-drive", "6"],
                    ["Proposta", "3"],
                    ["Ganho", "2"],
                    ["Perdido", "1"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-background/60 p-3">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="text-lg font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Card className="relative overflow-hidden bg-background/60 p-10">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-3 lg:col-span-8">
                <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Pronto para organizar sua operação e vender com consistência?
                </h3>
                <p className="text-muted-foreground">
                  Crie sua conta e comece hoje. Em minutos você já tem estoque,
                  leads e agenda funcionando.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button asChild size="lg" className="w-full">
                  <Link href="/cadastro">
                    Começar agora <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

