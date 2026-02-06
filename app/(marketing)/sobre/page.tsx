import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title="Feito para a realidade de quem vende carro todo dia."
        subtitle="Menos burocracia, mais previsibilidade. O MotorGestor nasce para organizar a operação de revendas pequenas e vendedores autônomos."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/cadastro">Começar agora</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contato">Falar com a equipe</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="bg-background/60 p-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Missão</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Ajudar pequenas operações a vender mais com processo simples,
                dados organizados e rotina de atendimento clara.
              </p>
            </Card>
            <Card className="bg-background/60 p-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Princípios</Badge>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Foco no essencial e rapidez no dia a dia</li>
                <li>Segurança real com isolamento por empresa</li>
                <li>UX limpa: menos cliques, mais clareza</li>
              </ul>
            </Card>
            <Card className="bg-background/60 p-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Transparência</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Preços simples, suporte humano e roadmap guiado por problemas
                reais do balcão e do WhatsApp.
              </p>
            </Card>
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Por que MotorGestor?
                </h2>
                <p className="text-muted-foreground">
                  Porque “gerir motor” aqui é gerir a operação: estoque, leads,
                  agenda e resultado. Sem depender de planilha.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-lg border bg-background/70 p-4">
                  <div className="text-sm font-medium">Roadmap</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Integrações, automações e relatórios avançados conforme o MVP
                    se estabiliza.
                  </p>
                </div>
                <div className="rounded-lg border bg-background/70 p-4">
                  <div className="text-sm font-medium">Suporte</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Conte com guias, materiais e atendimento para ajudar na adoção.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

