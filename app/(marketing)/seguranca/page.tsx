import Link from "next/link";
import { LockIcon, ShieldCheckIcon, DatabaseIcon, KeyIcon } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const items = [
  {
    icon: ShieldCheckIcon,
    title: "RLS por empresa (company_id)",
    description:
      "As permissões vivem no banco: cada usuário só enxerga dados do seu tenant.",
  },
  {
    icon: KeyIcon,
    title: "Auth gerenciado (Supabase)",
    description:
      "Sessões seguras, tokens e fluxo de autenticação com boas práticas.",
  },
  {
    icon: DatabaseIcon,
    title: "Postgres relacional",
    description:
      "Integridade com chaves, índices e regras — pronto para crescer com o produto.",
  },
  {
    icon: LockIcon,
    title: "Papéis e controle de acesso",
    description:
      "Admin e Vendedor. Admin gerencia configurações e visões mais amplas.",
  },
];

export default function SegurancaPage() {
  return (
    <>
      <PageHero
        eyebrow="Segurança"
        title="Segurança por padrão — multi-tenant de verdade."
        subtitle="Isolamento por empresa com Row Level Security no Postgres, além de autenticação e boas práticas."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/cadastro">Criar conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/politica-de-privacidade">Privacidade</Link>
          </Button>
        </div>
      </PageHero>

      <section className="pb-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((i) => (
              <Card key={i.title} className="bg-background/60 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <i.icon className="size-5 text-emerald-300" />
                    <div className="font-medium">{i.title}</div>
                  </div>
                  <Badge variant="secondary">MVP</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-10 bg-background/60 p-8">
            <div className="space-y-2">
              <div className="text-base font-medium">RLS: o que isso significa?</div>
              <p className="text-sm text-muted-foreground">
                Mesmo que alguém tente consultar diretamente o banco, as políticas
                impedem leitura/escrita fora do tenant. É uma camada forte de
                segurança, aplicada no Postgres.
              </p>
            </div>
            <div className="mt-5 text-sm text-muted-foreground">
              Quer ver o schema? O repositório inclui SQL com políticas para{" "}
              <span className="font-mono">profiles</span>, <span className="font-mono">companies</span>,{" "}
              <span className="font-mono">vehicles</span>, <span className="font-mono">leads</span> e{" "}
              <span className="font-mono">events</span>.
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}

