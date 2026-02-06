"use client";

import Link from "next/link";
import { BookOpenIcon, LifeBuoyIcon, ShieldCheckIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AjudaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ajuda</h1>
        <p className="text-sm text-muted-foreground">
          Links rápidos, boas práticas e suporte.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-background/60 p-6">
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
        <Card className="bg-background/60 p-6">
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
        <Card className="bg-background/60 p-6">
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
      </div>

      <Card className="bg-background/60 p-6">
        <div className="text-base font-medium">Boas práticas rápidas</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Responda “Novos” todos os dias e agende o próximo passo.</li>
          <li>Atualize status do veículo (disponível/reservado/vendido).</li>
          <li>Use notas curtas e objetivas para não perder contexto.</li>
        </ul>
      </Card>
    </div>
  );
}

