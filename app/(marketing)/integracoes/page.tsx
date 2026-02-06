import Link from "next/link";
import { PlugIcon, MessageCircleIcon, FileSpreadsheetIcon, WebhookIcon } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
  {
    icon: MessageCircleIcon,
    title: "WhatsApp (planejado)",
    description: "Atalhos, templates e registro de interações.",
    status: "Planejado",
  },
  {
    icon: FileSpreadsheetIcon,
    title: "Importação CSV (planejado)",
    description: "Traga veículos e leads de planilhas com mapeamento simples.",
    status: "Planejado",
  },
  {
    icon: WebhookIcon,
    title: "Webhooks (futuro)",
    description: "Conecte eventos do produto com sistemas externos.",
    status: "Futuro",
  },
  {
    icon: PlugIcon,
    title: "API (futuro)",
    description: "Endpoints para integrações mais profundas e BI.",
    status: "Futuro",
  },
];

export default function IntegracoesPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrações"
        title="Conecte o MotorGestor ao seu fluxo."
        subtitle="O MVP foca no essencial. Integrações entram em camadas conforme maturidade e demanda."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contato">Pedir integração</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/recursos">Ver recursos</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {integrations.map((i) => (
              <Card key={i.title} className="bg-background/60 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <i.icon className="size-5 text-emerald-300" />
                    <div className="font-medium">{i.title}</div>
                  </div>
                  <Badge variant="secondary">{i.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

