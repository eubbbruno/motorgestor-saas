"use client";

import Link from "next/link";
import { CreditCardIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AssinaturaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-sm text-muted-foreground">
          No MVP, o gerenciamento de cobrança é simplificado.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="size-4 text-muted-foreground" />
              <div className="text-base font-medium">Plano atual</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Você está no plano <span className="font-medium">Starter</span> (demo/MVP).
            </p>
          </div>
          <Badge variant="secondary">MVP</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-background/60 p-4">
            <div className="text-sm font-medium">O que inclui</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Veículos e leads ilimitados</li>
              <li>Agenda simples</li>
              <li>RLS por empresa</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-background/60 p-4">
            <div className="text-sm font-medium">Upgrade</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Quer mais usuários e relatórios? Fale com a equipe para migrar para Pro.
            </p>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline">
                <Link href="/precos">Ver planos</Link>
              </Button>
              <Button asChild>
                <Link href="/contato">Falar com vendas</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

