import Link from "next/link";
import { BookOpenIcon, LifeBuoyIcon, MessageSquareIcon } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: BookOpenIcon,
    title: "Começando",
    items: [
      "Criar conta e configurar empresa",
      "Cadastrar veículos e organizar estoque",
      "Registrar leads e acompanhar funil",
    ],
  },
  {
    icon: LifeBuoyIcon,
    title: "Operação",
    items: ["Agenda e retornos", "Boas práticas de pipeline", "Relatórios básicos"],
  },
  {
    icon: MessageSquareIcon,
    title: "Conta & segurança",
    items: ["Acesso e permissões", "Privacidade e RLS", "Problemas de login"],
  },
];

export default function SuportePage() {
  return (
    <>
      <PageHero
        eyebrow="Suporte"
        title="Ajuda para operar melhor — sem perder tempo."
        subtitle="Guias, melhores práticas e caminhos rápidos para resolver dúvidas comuns."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contato">Falar com suporte</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/recursos">Ver recursos</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            {categories.map((c) => (
              <Card key={c.title} className="bg-background/60 p-6">
                <c.icon className="size-5 text-emerald-300" />
                <div className="mt-3 font-medium">{c.title}</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-8">
                <div className="text-base font-medium">Precisa de atendimento?</div>
                <p className="text-sm text-muted-foreground">
                  Envie detalhes da sua operação e do que você está tentando
                  fazer. Quanto mais contexto, mais rápido resolvemos.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button asChild className="w-full" size="lg">
                  <Link href="/contato">Abrir chamado</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

