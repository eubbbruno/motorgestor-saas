import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "R$ 99",
    period: "/mês",
    description: "Para vendedor autônomo ou revenda bem pequena.",
    features: [
      "1 empresa",
      "Até 2 usuários",
      "Veículos ilimitados",
      "Leads ilimitados",
      "Agenda simples",
      "Dashboard básico",
      "RLS por empresa",
    ],
  },
  {
    name: "Pro",
    price: "R$ 249",
    period: "/mês",
    description: "Para operação com equipe e rotina de vendas.",
    highlight: true,
    features: [
      "Até 8 usuários",
      "Campos e filtros avançados",
      "Relatórios essenciais",
      "Metas e conversão por etapa",
      "Suporte prioritário",
      "Logs de atividade (MVP+)",
    ],
  },
  {
    name: "Business",
    price: "Sob consulta",
    period: "",
    description: "Para múltiplas lojas e necessidades específicas.",
    features: [
      "Usuários ilimitados",
      "SLA + onboarding assistido",
      "Integrações sob demanda",
      "Auditoria e permissões avançadas",
      "Ambiente dedicado (opcional)",
    ],
  },
];

export default function PrecosPage() {
  return (
    <>
      <PageHero
        eyebrow="Planos"
        title="Preços simples. Valor real na operação."
        subtitle="Comece leve e evolua conforme sua revenda cresce. Sem pegadinhas, sem taxa por veículo."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/cadastro">Começar agora</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contato">Falar com vendas</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((p) => (
              <Card
                key={p.name}
                className={[
                  "bg-background/60 p-6",
                  p.highlight
                    ? "relative border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,.25),0_30px_80px_-50px_rgba(16,185,129,.55)]"
                    : "",
                ].join(" ")}
              >
                {p.highlight ? (
                  <Badge className="absolute right-6 top-6" variant="secondary">
                    Mais escolhido
                  </Badge>
                ) : null}

                <div className="space-y-2">
                  <div className="text-lg font-semibold">{p.name}</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-semibold tracking-tight">
                      {p.price}
                    </div>
                    <div className="pb-1 text-sm text-muted-foreground">
                      {p.period}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>

                <div className="mt-5 space-y-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <CheckIcon className="mt-0.5 size-4 text-emerald-300" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild className="w-full" variant={p.highlight ? "default" : "outline"}>
                    <Link href="/cadastro">Escolher {p.name}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Precisa de algo específico? Veja{" "}
            <Link href="/seguranca" className="underline underline-offset-4">
              segurança
            </Link>{" "}
            e{" "}
            <Link href="/integracoes" className="underline underline-offset-4">
              integrações
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

