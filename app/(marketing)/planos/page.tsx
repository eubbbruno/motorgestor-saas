import Link from "next/link";
import { CheckIcon, CrownIcon, SparklesIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    description: "Para organizar o básico e rodar o primeiro funil.",
    limits: {
      vehicles: "5 veículos",
      leads: "20 leads",
      ai: "Não",
      pipeline: "Sim",
      metrics: "Sim",
    },
    cta: "Começar grátis",
    href: "/cadastro",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "R$ 99/mês",
    description: "Para operar todo dia com escala, padrão e IA.",
    limits: {
      vehicles: "1000 veículos",
      leads: "1000 leads",
      ai: "Sim",
      pipeline: "Sim",
      metrics: "Sim",
    },
    cta: "Assinar Pro",
    href: "/cadastro",
    variant: "default" as const,
  },
];

const rows = [
  { label: "Veículos", key: "vehicles" as const },
  { label: "Leads", key: "leads" as const },
  { label: "IA (mensagens/descrições)", key: "ai" as const },
  { label: "Pipeline visual", key: "pipeline" as const },
  { label: "Métricas em tempo real", key: "metrics" as const },
];

export default function PlanosPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container className="max-w-7xl">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Badge variant="secondary" className="border bg-background">
              Planos
            </Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Escolha um plano que acompanha sua operação.
            </h1>
            <p className="text-pretty text-muted-foreground">
              Comece no Free e faça upgrade quando quiser. Estrutura pronta para cobrança futura.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {plans.map((p) => (
              <Card
                key={p.name}
                className="rounded-xl border bg-background/60 p-7 shadow-sm backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold">{p.name}</div>
                      {p.name === "Pro" ? (
                        <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/10">
                          <CrownIcon className="mr-1 size-3" /> Recomendado
                        </Badge>
                      ) : null}
                    </div>
                    <div className="text-3xl font-semibold tracking-tight">{p.price}</div>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                  <div className="rounded-xl border bg-background p-2">
                    <SparklesIcon className="size-4 text-muted-foreground" />
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                    <span>{p.limits.pipeline} pipeline visual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                    <span>{p.limits.metrics} métricas em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                    <span>{p.limits.vehicles}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                    <span>{p.limits.leads}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 text-emerald-500" />
                    <span>IA: {p.limits.ai}</span>
                  </li>
                </ul>

                <div className="mt-7">
                  <Button asChild size="lg" variant={p.variant} className="w-full">
                    <Link href={p.href}>
                      {p.cta} {p.name === "Pro" ? <CrownIcon className="ml-2 size-4" /> : null}
                    </Link>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Placeholder de billing • sem cobrança automática ainda
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-10 overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
            <div className="grid gap-4 p-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="text-sm font-medium">Comparação rápida</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uma tabela simples para você decidir rápido.
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-0 rounded-xl border bg-background">
                  <div className="p-4 text-sm font-medium text-muted-foreground">Recurso</div>
                  <div className="border-l p-4 text-sm font-medium">Free</div>
                  <div className="border-l p-4 text-sm font-medium">Pro</div>
                  {rows.map((r) => (
                    <div key={r.key} className="contents">
                      <div className="border-t p-4 text-sm text-muted-foreground">{r.label}</div>
                      <div className="border-l border-t p-4 text-sm">{plans[0].limits[r.key]}</div>
                      <div className="border-l border-t p-4 text-sm">{plans[1].limits[r.key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/contato">Falar com a equipe</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

