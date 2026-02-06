import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    title: "Fullstack (Next.js + Supabase)",
    level: "Pleno/Sênior",
    type: "Remoto",
    description:
      "Construir features do app (CRUD, relatórios, UX) com foco em qualidade e velocidade.",
  },
  {
    title: "Product Designer (UX/UI)",
    level: "Sênior",
    type: "Remoto",
    description:
      "Melhorar fluxos de vendas, onboarding e interfaces premium para B2B.",
  },
  {
    title: "CS / Suporte",
    level: "Pleno",
    type: "Híbrido",
    description:
      "Ajudar clientes a adotar o produto e transformar feedback em melhorias.",
  },
];

export default function CarreirasPage() {
  return (
    <>
      <PageHero
        eyebrow="Carreiras"
        title="Construa o futuro da gestão para revendas pequenas."
        subtitle="Produto enxuto, impacto direto e foco em resolver problemas reais de operação e vendas."
      >
        <Button asChild size="lg">
          <Link href="/contato">Quero participar</Link>
        </Button>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4">
            {roles.map((r) => (
              <Card key={r.title} className="bg-background/60 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-base font-medium">{r.title}</div>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{r.level}</Badge>
                    <Badge variant="secondary">{r.type}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="space-y-2">
              <div className="text-base font-medium">Não achou sua vaga?</div>
              <p className="text-sm text-muted-foreground">
                Envie uma mensagem com seu perfil e o que você quer construir.
              </p>
              <div className="pt-2">
                <Button asChild variant="outline">
                  <Link href="/contato">Falar com a gente</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

