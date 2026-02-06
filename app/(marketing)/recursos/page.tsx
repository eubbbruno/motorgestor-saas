import Link from "next/link";
import {
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  LockIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: CarIcon,
    title: "Veículos (CRUD completo)",
    description:
      "Cadastre, edite e controle status do estoque (disponível, reservado, vendido).",
  },
  {
    icon: UsersIcon,
    title: "Leads com funil",
    description:
      "Novo → Contato → Visita → Proposta → Ganho/Perdido. Com notas e histórico.",
  },
  {
    icon: CalendarIcon,
    title: "Agenda simples",
    description:
      "Agende retornos e test-drives. Eventos vinculados ao lead e com horários.",
  },
  {
    icon: BarChart3Icon,
    title: "Dashboard e relatórios",
    description:
      "Métricas essenciais para rotina: volume de leads, conversão e evolução por etapa.",
  },
  {
    icon: TagIcon,
    title: "Multi-tenant por empresa",
    description:
      "Cada concessionária é um “tenant” isolado. Dados separados com RLS no banco.",
  },
  {
    icon: LockIcon,
    title: "Segurança e permissões",
    description:
      "Papéis Admin/Vendedor e regras de acesso por company_id diretamente no Postgres.",
  },
];

export default function RecursosPage() {
  return (
    <>
      <PageHero
        eyebrow="Recursos"
        title="Tudo o que você precisa para vender mais — e organizar a rotina."
        subtitle="Foco no essencial: estoque, leads, agenda e métricas. Sem complexidade desnecessária."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/cadastro">Começar agora</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/seguranca">Ver segurança</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="bg-background/60 p-6">
                <f.icon className="size-5 text-emerald-300" />
                <div className="mt-3 font-medium">{f.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">MVP robusto</Badge>
                  <Badge variant="secondary">Supabase + RLS</Badge>
                  <Badge variant="secondary">shadcn/ui</Badge>
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight">
                  Stack moderna, foco em performance e segurança.
                </h2>
                <p className="text-muted-foreground">
                  O MotorGestor foi pensado para ser rápido no dia a dia e seguro
                  por padrão — com isolamento real de dados por empresa.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="grid gap-3">
                  <div className="rounded-lg border bg-background/70 p-4">
                    <div className="text-sm font-medium">Auth + Postgres</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Login seguro e banco relacional pronto para crescer.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background/70 p-4">
                    <div className="text-sm font-medium">RLS por company_id</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Permissões no banco — não só na UI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Quer ver o produto em ação?
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/precos">Ver planos</Link>
                </Button>
                <Button asChild>
                  <Link href="/cadastro">Criar conta</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

