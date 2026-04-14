"use client";

import * as React from "react";
import { CheckCircle2Icon, UploadCloudIcon, XCircleIcon } from "lucide-react";

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
import { useVehicles } from "@/features/vehicles/hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

type Marketplace = {
  id: string;
  name: string;
  color: string;
  logo: string;
  description: string;
  comingSoon?: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARKETPLACES: Marketplace[] = [
  {
    id: "webmotors",
    name: "Webmotors",
    color: "#E8003D",
    logo: "W",
    description: "Publique e sincronize seu estoque no maior marketplace de veículos do Brasil.",
  },
  {
    id: "olx",
    name: "OLX Autos",
    color: "#6E1FFF",
    logo: "OLX",
    description: "Alcance milhões de compradores na OLX com sincronização automática de anúncios.",
  },
  {
    id: "icarros",
    name: "iCarros",
    color: "#0070F3",
    logo: "iC",
    description: "Publique anúncios e receba leads do portal iCarros integrado ao seu CRM.",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    color: "#25D366",
    logo: "WA",
    description: "Templates de atendimento e histórico completo no perfil de cada lead.",
    comingSoon: true,
  },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none",
        enabled
          ? "border-[#4AE54A] bg-[#4AE54A]"
          : "border-[rgba(74,229,74,0.2)] bg-[#0A1A0C]",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 self-center",
          enabled ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({
  marketplace,
  onClose,
}: {
  marketplace: Marketplace;
  onClose: () => void;
}) {
  const vehicles = useVehicles();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  function toggleVehicle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    const all = (vehicles.data ?? []).map((v) => v.id);
    if (selected.size === all.length) setSelected(new Set());
    else setSelected(new Set(all));
  }

  function handleExport() {
    // Visual only — API integration comes later
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar para {marketplace.name}</DialogTitle>
          <DialogDescription>
            Selecione os veículos que deseja exportar para o marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {vehicles.isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando veículos...</div>
          ) : (vehicles.data ?? []).length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum veículo cadastrado.</div>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-[#4AE54A] hover:underline"
              >
                {selected.size === (vehicles.data ?? []).length ? "Desmarcar todos" : "Selecionar todos"}
              </button>
              {(vehicles.data ?? []).map((v) => (
                <label
                  key={v.id}
                  className="flex items-center gap-3 rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0F2014] px-3 py-2.5 cursor-pointer hover:border-[rgba(74,229,74,0.25)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(v.id)}
                    onChange={() => toggleVehicle(v.id)}
                    className="accent-[#4AE54A]"
                  />
                  <span className="flex-1 text-sm text-white truncate">{v.title}</span>
                  {v.price ? (
                    <span className="text-xs text-[#6B9E6B] shrink-0">
                      R$ {Number(v.price).toLocaleString("pt-BR")}
                    </span>
                  ) : null}
                </label>
              ))}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={selected.size === 0}
            className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]"
          >
            <UploadCloudIcon className="mr-2 size-4" />
            Exportar {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function MarketplaceCard({ marketplace }: { marketplace: Marketplace }) {
  const [enabled, setEnabled] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6 transition-all duration-200 hover:border-[rgba(74,229,74,0.22)] hover:shadow-[0_0_20px_rgba(74,229,74,0.06)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.2)] to-transparent" />

        {marketplace.comingSoon && (
          <div className="absolute right-4 top-4">
            <Badge className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[10px]">
              Em breve
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div
            className="size-12 rounded-2xl flex items-center justify-center text-sm font-extrabold shrink-0"
            style={{
              backgroundColor: marketplace.color + "22",
              border: `1px solid ${marketplace.color}40`,
              color: marketplace.color,
            }}
          >
            {marketplace.logo}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white mb-1">{marketplace.name}</div>
            <p className="text-xs text-[#6B9E6B] leading-relaxed">{marketplace.description}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[rgba(74,229,74,0.06)] pt-4">
          <div className="flex items-center gap-2">
            {marketplace.comingSoon ? (
              <XCircleIcon className="size-4 text-[#6B9E6B]/50" />
            ) : enabled ? (
              <CheckCircle2Icon className="size-4 text-[#4AE54A]" />
            ) : (
              <XCircleIcon className="size-4 text-[#6B9E6B]/50" />
            )}
            <span
              className={[
                "text-xs font-semibold",
                marketplace.comingSoon
                  ? "text-[#6B9E6B]/50"
                  : enabled
                    ? "text-[#4AE54A]"
                    : "text-[#6B9E6B]/60",
              ].join(" ")}
            >
              {marketplace.comingSoon ? "Indisponível" : enabled ? "Conectado" : "Desconectado"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!marketplace.comingSoon && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOpen(true)}
                  disabled={!enabled}
                  className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white disabled:opacity-40"
                >
                  <UploadCloudIcon className="mr-1.5 size-3.5" />
                  Exportar agora
                </Button>
                <Toggle enabled={enabled} onChange={() => setEnabled((v) => !v)} />
              </>
            )}
          </div>
        </div>
      </div>

      {exportOpen && (
        <ExportModal marketplace={marketplace} onClose={() => setExportOpen(false)} />
      )}
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
        description="Conecte e exporte seu estoque para os principais portais de venda."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {MARKETPLACES.map((m) => (
          <MarketplaceCard key={m.id} marketplace={m} />
        ))}
      </div>

      <p className="text-xs text-[#6B9E6B]/60 text-center pt-2">
        A lógica de sincronização com APIs dos marketplaces está em desenvolvimento.
      </p>
    </div>
  );
}
