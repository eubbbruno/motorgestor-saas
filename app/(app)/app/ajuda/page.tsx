"use client";

import Link from "next/link";
import { BookOpenIcon, LifeBuoyIcon, ShieldCheckIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

export default function AjudaPage() {
  return (
    <div className="space-y-6">
      <PageHeader kicker="Suporte" title="Ajuda" description="Links rápidos, boas práticas e suporte." />

      <div className="grid gap-4 lg:grid-cols-3">
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <BookOpenIcon className="size-5 text-emerald-300" />
          <div className="mt-3 font-medium">Guias</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja tutoriais e melhores práticas para operar o funil e o estoque.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/suporte">Abrir suporte</Link>
            </Button>
          </div>
          </Card>
        </PremiumSurface>
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <LifeBuoyIcon className="size-5 text-emerald-300" />
          <div className="mt-3 font-medium">Falar com a equipe</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dúvidas de implantação, planos ou uso no dia a dia.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/contato">Contato</Link>
            </Button>
          </div>
          </Card>
        </PremiumSurface>
        <PremiumSurface>
          <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <ShieldCheckIcon className="size-5 text-emerald-300" />
          <div className="mt-3 font-medium">Segurança</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Saiba como funciona o isolamento por empresa e as permissões.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/seguranca">Ver segurança</Link>
            </Button>
          </div>
          </Card>
        </PremiumSurface>
      </div>

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="text-base font-medium">Boas práticas rápidas</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Responda “Novos” todos os dias e agende o próximo passo.</li>
          <li>Atualize status do veículo (disponível/reservado/vendido).</li>
          <li>Use notas curtas e objetivas para não perder contexto.</li>
        </ul>
        </Card>
      </PremiumSurface>
    </div>
  );
}

