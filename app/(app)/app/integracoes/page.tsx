"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  UploadCloudIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { useVehicles } from "@/features/vehicles/hooks";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = {
  id: "webmotors" | "olx" | "mercadolivre";
  name: string;
  color: string;
  logoText: string;
  description: string;
  steps: string[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  {
    id: "webmotors",
    name: "Webmotors",
    color: "#E8003D",
    logoText: "W",
    description: "Maior marketplace de veículos do Brasil.",
    steps: [
      "Acesse o Painel Webmotors → Importar estoque",
      "Cole a URL do feed XML no campo indicado",
      "Configure atualização automática diária",
    ],
  },
  {
    id: "olx",
    name: "OLX Autos",
    color: "#6E1FFF",
    logoText: "OLX",
    description: "Alcance milhões de compradores na OLX.",
    steps: [
      "Acesse OLX Pro → Gerenciar anúncios → Importar",
      "Cole a URL do feed ou baixe o XML",
      "Faça upload manual ou configure integração automática",
    ],
  },
  {
    id: "mercadolivre",
    name: "Mercado Livre",
    color: "#FFE600",
    logoText: "ML",
    description: "Publique no Mercado Livre Veículos em massa.",
    steps: [
      "Acesse Mercado Livre → Veículos → Publicar",
      "Escolha Importação em massa",
      "Cole a URL do feed XML no campo indicado",
    ],
  },
];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motorgestor.com.br";

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useExportToken() {
  return useQuery({
    queryKey: ["exports", "token"],
    queryFn: async () => {
      const res = await fetch("/api/exports/token");
      const data = (await res.json()) as { ok: boolean; token?: string | null; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Erro ao buscar token.");
      return data.token ?? null;
    },
    retry: false,
  });
}

// ─── Feed URL helper ──────────────────────────────────────────────────────────

function feedUrl(platformId: string, token: string | null | undefined): string {
  const base = `${SITE_URL}/api/exports/${platformId}`;
  return token ? `${base}?token=${token}` : `${base} (faça login para ver seu token)`;
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({
  platform,
  token,
  vehicleCount,
}: {
  platform: Platform;
  token: string | null | undefined;
  vehicleCount: number;
}) {
  const url = feedUrl(platform.id, token);
  const hasToken = Boolean(token);

  async function copyUrl() {
    if (!hasToken) {
      toast.error("Token ainda não disponível. Aguarde carregar.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copiada.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  function downloadXml() {
    if (!hasToken) {
      toast.error("Token ainda não disponível.");
      return;
    }
    const a = document.createElement("a");
    a.href = `/api/exports/${platform.id}?token=${token}`;
    a.download = `${platform.id}-estoque.xml`;
    a.click();
  }

  function testXml() {
    window.open(`/api/exports/${platform.id}${token ? `?token=${token}` : ""}`, "_blank");
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6 transition-all duration-200 hover:border-[rgba(74,229,74,0.22)]">
      {/* Linha decorativa topo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.2)] to-transparent" />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold"
          style={{
            backgroundColor: platform.color + "22",
            border: `1px solid ${platform.color}40`,
            color: platform.color,
          }}
        >
          {platform.logoText}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{platform.name}</span>
            <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A] text-[10px] font-semibold">
              {vehicleCount} veículo{vehicleCount !== 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-[#6B9E6B]">{platform.description}</p>
        </div>
      </div>

      {/* Feed URL */}
      <div className="mt-5 rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] px-3 py-2.5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B9E6B]">
          URL do feed XML
        </div>
        <div className="truncate font-mono text-xs text-white/80">
          {hasToken ? url : <span className="text-[#6B9E6B]/60 italic">Carregando token…</span>}
        </div>
      </div>

      {/* Ações */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white"
          onClick={copyUrl}
          disabled={!hasToken}
        >
          <CopyIcon className="mr-1.5 size-3.5" />
          Copiar URL
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white"
          onClick={downloadXml}
          disabled={!hasToken}
        >
          <DownloadIcon className="mr-1.5 size-3.5" />
          Baixar XML
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white"
          onClick={testXml}
        >
          <ExternalLinkIcon className="mr-1.5 size-3.5" />
          Testar XML
        </Button>
      </div>

      {/* Instruções */}
      <div className="mt-5 border-t border-[rgba(74,229,74,0.06)] pt-4">
        <div className="mb-2 text-xs font-semibold text-white/70">Como usar</div>
        <ol className="space-y-1.5">
          {platform.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#6B9E6B]">
              <span
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#4AE54A]/10 text-[10px] font-bold text-[#4AE54A]"
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegracoesAppPage() {
  const vehicles = useVehicles();
  const exportToken = useExportToken();

  const exportableCount = (vehicles.data ?? []).filter(
    (v) => v.status === "disponivel" || v.status === "reservado",
  ).length;

  const token = exportToken.data;

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Marketplaces"
        title="Integrações"
        description="Exporte seu estoque para os principais portais via feed XML automático."
        right={
          <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 px-3 py-1.5 text-sm font-semibold text-[#4AE54A]">
            <UploadCloudIcon className="mr-1.5 size-4" />
            {vehicles.isLoading ? "…" : exportableCount} veículos prontos para exportar
          </Badge>
        }
      />

      {/* Aviso de token */}
      {!exportToken.isLoading && !token && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/8 p-4 text-sm text-yellow-400">
          <strong>Token de exportação não encontrado.</strong> Execute a migration SQL abaixo no
          Supabase Dashboard para ativar o acesso via URL:
          <pre className="mt-2 rounded-lg bg-black/30 p-3 font-mono text-xs text-yellow-300/80 overflow-x-auto">
            {`alter table public.companies\n  add column if not exists export_token text default gen_random_uuid()::text;`}
          </pre>
        </div>
      )}

      {/* Cards de plataformas */}
      <div className="grid gap-4 lg:grid-cols-3">
        {PLATFORMS.map((p) => (
          <PlatformCard
            key={p.id}
            platform={p}
            token={token}
            vehicleCount={exportableCount}
          />
        ))}
      </div>

      {/* Checklist de requisitos */}
      <div className="rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0F2014] p-5">
        <div className="mb-3 text-sm font-semibold text-white">Requisitos para o feed funcionar</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            {
              ok: exportableCount > 0,
              label: "Veículos com status Disponível ou Reservado cadastrados",
            },
            {
              ok: Boolean(token),
              label: "Migration export_token aplicada no Supabase",
            },
            {
              ok: true,
              label: "Bucket vehicle-photos público no Supabase Storage (para imagens no feed)",
            },
            {
              ok: true,
              label: "Veículos com Make, Model e Ano preenchidos para melhor qualidade do feed",
            },
          ].map(({ ok, label }) => (
            <div key={label} className="flex items-start gap-2 text-xs">
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                  ok
                    ? "bg-[#4AE54A]/15 text-[#4AE54A]"
                    : "bg-yellow-500/10 text-yellow-400",
                )}
              >
                <CheckIcon className="size-2.5" />
              </span>
              <span className={ok ? "text-[#6B9E6B]" : "text-yellow-400/80"}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
