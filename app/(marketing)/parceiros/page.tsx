import Link from "next/link";
import { BadgeCheckIcon, HandshakeIcon, MegaphoneIcon } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const partnerTypes = [
  {
    icon: HandshakeIcon,
    title: "Consultorias e implantação",
    description: "Ajude revendas a estruturar processo e adotar o MotorGestor.",
  },
  {
    icon: MegaphoneIcon,
    title: "Agências e tráfego",
    description: "Integre campanhas e feedback de leads para melhorar conversão.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Parceiros tecnológicos",
    description: "Integrações com CRMs, telefonia, BI e ferramentas de mensagens.",
  },
];

export default function ParceirosPage() {
  return (
    <>
      <PageHero
        eyebrow="Parceiros"
        title="Parcerias para acelerar resultados."
        subtitle="Trabalhe com a gente para levar operação organizada e previsibilidade para revendas pequenas."
      >
        <Button asChild size="lg">
          <Link href="/contato">Quero ser parceiro</Link>
        </Button>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map((p) => (
              <Card key={p.title} className="bg-background/60 p-6">
                <p.icon className="size-5 text-emerald-300" />
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-medium">{p.title}</div>
                  <Badge variant="secondary">Programa</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="space-y-2">
              <div className="text-base font-medium">Como funciona</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Você indica/implanta clientes e acompanha adoção.</li>
                <li>Recebe benefícios e materiais para acelerar vendas.</li>
                <li>Feedback direto para evoluir integrações e fluxos.</li>
              </ul>
              <div className="pt-3">
                <Button asChild variant="outline">
                  <Link href="/contato">Vamos conversar</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

