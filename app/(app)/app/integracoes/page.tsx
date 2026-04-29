"use client";

import * as React from "react";
import { toast } from "sonner";
import { ClockIcon, SearchIcon, SettingsIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type MarketplaceCard = {
  id: string;
  name: string;
  color: string;
  logoText: string;
  status: string;
  statusNote: string;
};

type PlacaCard = {
  provider: string;
  price: string;
  envKey: string;
  docUrl: string;
  steps: string[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARKETPLACES: MarketplaceCard[] = [
  {
    id: "webmotors",
    name: "Webmotors",
    color: "#E8003D",
    logoText: "W",
    status: "Em breve",
    statusNote: "Integração via parceiro oficial — aguardando aprovação do contrato.",
  },
  {
    id: "olx",
    name: "OLX Autos",
    color: "#6E1FFF",
    logoText: "OLX",
    status: "Em breve",
    statusNote: "API em aprovação junto ao time OLX Pro.",
  },
  {
    id: "mercadolivre",
    name: "Mercado Livre",
    color: "#FFE600",
    logoText: "ML",
    status: "Em breve",
    statusNote: "Em desenvolvimento — integração com ML Veículos prevista.",
  },
];

const PLACA_PROVIDER: PlacaCard = {
  provider: "APIPlacas",
  price: "R$29/mês",
  envKey: "VEHICLE_LOOKUP_API_KEY",
  docUrl: "https://apiplacas.com.br",
  steps: [
    "Acesse apiplacas.com.br e crie sua conta",
    "Gere uma API Key no painel",
    "Adicione VEHICLE_LOOKUP_PROVIDER=apiplacas e VEHICLE_LOOKUP_API_KEY=sua-chave no Vercel → Settings → Environment Variables",
    "Faça redeploy — a busca por placa ficará ativa no cadastro de veículos",
  ],
};

// ─── Marketplace Card ─────────────────────────────────────────────────────────

function MarketplaceCardItem({ card }: { card: MarketplaceCard }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.15)] to-transparent" />

      <div className="flex items-start gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold"
          style={{
            backgroundColor: card.color + "22",
            border: `1px solid ${card.color}40`,
            color: card.color,
          }}
        >
          {card.logoText}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{card.name}</span>
            <Badge className="border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-semibold">
              <ClockIcon className="mr-1 size-2.5" />
              {card.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-[#6B9E6B] leading-relaxed">{card.statusNote}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-[rgba(74,229,74,0.06)] pt-3">
        <Button
          size="sm"
          variant="outline"
          disabled
          className="border-[rgba(74,229,74,0.15)] bg-transparent text-[#6B9E6B]/50 cursor-not-allowed"
        >
          Disponível em breve
        </Button>
      </div>
    </div>
  );
}

// ─── Placa Card ───────────────────────────────────────────────────────────────

function PlacaConfigCard() {
  const [open, setOpen] = React.useState(false);

  async function copyEnvInstructions() {
    try {
      await navigator.clipboard.writeText(
        `VEHICLE_LOOKUP_PROVIDER=apiplacas\nVEHICLE_LOOKUP_API_KEY=sua-chave-aqui`,
      );
      toast.success("Copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-[#4AE54A]/20 bg-[#0F2014] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4AE54A]/30 to-transparent" />

        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#4AE54A]/10 border border-[#4AE54A]/30">
            <SearchIcon className="size-5 text-[#4AE54A]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Consulta por Placa</span>
              <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A] text-[10px] font-semibold">
                Disponível
              </Badge>
            </div>
            <p className="mt-1 text-xs text-[#6B9E6B] leading-relaxed">
              Ative a busca automática por placa no cadastro de veículos.
              Preenche marca, modelo, ano e cor automaticamente via{" "}
              <span className="text-white font-medium">{PLACA_PROVIDER.provider}</span>{" "}
              ({PLACA_PROVIDER.price}).
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-[rgba(74,229,74,0.06)] pt-3">
          <Button
            size="sm"
            className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
            onClick={() => setOpen(true)}
          >
            <SettingsIcon className="mr-1.5 size-3.5" />
            Configurar
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurar Consulta por Placa</DialogTitle>
            <DialogDescription>
              Integração com {PLACA_PROVIDER.provider} — {PLACA_PROVIDER.price}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ol className="space-y-3">
              {PLACA_PROVIDER.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4AE54A]/10 text-[10px] font-bold text-[#4AE54A]">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>

            <div className="rounded-xl border border-[rgba(74,229,74,0.15)] bg-[#0A1A0C] p-3">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B9E6B]">
                Variáveis de ambiente
              </div>
              <pre className="font-mono text-xs text-white/80">{`VEHICLE_LOOKUP_PROVIDER=apiplacas\nVEHICLE_LOOKUP_API_KEY=sua-chave-aqui`}</pre>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/8 p-3 text-xs text-blue-400">
              <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
              Após salvar as variáveis no Vercel, faça redeploy. A busca por placa ficará ativa automaticamente no formulário de cadastro de veículos.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]"
              onClick={copyEnvInstructions}
            >
              Copiar variáveis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegracoesAppPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Marketplaces"
        title="Integrações"
        description="Conecte seu estoque aos principais portais e ferramentas."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETPLACES.map((m) => (
          <MarketplaceCardItem key={m.id} card={m} />
        ))}
      </div>

      <PlacaConfigCard />
    </div>
  );
}
