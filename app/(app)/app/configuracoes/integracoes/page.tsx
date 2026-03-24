"use client";

import * as React from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Integration = {
  id: string;
  name: string;
  description: string;
  color: string;
  logo: string;
  category: string;
  comingSoon?: boolean;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const integrations: Integration[] = [
  {
    id: "webmotors",
    name: "Webmotors",
    description: "Publique e sincronize seus anúncios no maior marketplace de veículos do Brasil automaticamente.",
    color: "#E8003D",
    logo: "W",
    category: "Marketplace",
  },
  {
    id: "olx",
    name: "OLX Autos",
    description: "Sincronize seu estoque com a OLX e alcance milhões de compradores em todo o Brasil.",
    color: "#6E1FFF",
    logo: "OLX",
    category: "Marketplace",
  },
  {
    id: "icarros",
    name: "iCarros",
    description: "Integração com o portal iCarros para publicação automática de anúncios e recebimento de leads.",
    color: "#0070F3",
    logo: "iC",
    category: "Marketplace",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Templates de atendimento, disparo automático e histórico completo no perfil de cada lead.",
    color: "#25D366",
    logo: "WA",
    category: "Comunicação",
    comingSoon: true,
  },
];

// ─── Toggle component ─────────────────────────────────────────────────────────

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

// ─── Card ─────────────────────────────────────────────────────────────────────

function IntegrationCard({ integration }: { integration: Integration }) {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] p-6 transition-all duration-200 hover:border-[rgba(74,229,74,0.22)] hover:shadow-[0_0_20px_rgba(74,229,74,0.06)]">
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.2)] to-transparent" />

      {/* Coming soon overlay badge */}
      {integration.comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
            Em breve
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div
          className="size-12 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
          style={{
            backgroundColor: integration.color + "22",
            border: `1px solid ${integration.color}40`,
            color: integration.color,
          }}
        >
          {integration.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{integration.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-[#6B9E6B] border border-[rgba(74,229,74,0.12)] bg-[rgba(74,229,74,0.06)]">
              {integration.category}
            </span>
          </div>
          <p className="text-xs text-[#6B9E6B] leading-relaxed">{integration.description}</p>
        </div>
      </div>

      {/* Status row */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-[rgba(74,229,74,0.06)]">
        <div className="flex items-center gap-2">
          {integration.comingSoon ? (
            <XCircleIcon className="size-4 text-[#6B9E6B]/50" />
          ) : enabled ? (
            <CheckCircle2Icon className="size-4 text-[#4AE54A]" />
          ) : (
            <XCircleIcon className="size-4 text-[#6B9E6B]/50" />
          )}
          <span className={[
            "text-xs font-semibold",
            integration.comingSoon ? "text-[#6B9E6B]/50"
              : enabled ? "text-[#4AE54A]"
                : "text-[#6B9E6B]/60",
          ].join(" ")}>
            {integration.comingSoon ? "Indisponível" : enabled ? "Conectado" : "Desconectado"}
          </span>
        </div>

        {!integration.comingSoon && (
          <Toggle enabled={enabled} onChange={() => setEnabled((v) => !v)} />
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegracoesPage() {
  const connected = integrations.filter((i) => !i.comingSoon).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="size-1.5 rounded-full bg-[#4AE54A] animate-pulse" />
          <span className="text-xs text-[#6B9E6B] font-medium">Integrações</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Integrações
        </h1>
        <p className="text-sm text-[#6B9E6B] mt-1">
          Conecte marketplaces e ferramentas ao seu fluxo de vendas.
        </p>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014]">
        <div className="size-8 rounded-lg bg-[rgba(74,229,74,0.1)] flex items-center justify-center">
          <CheckCircle2Icon className="size-4 text-[#4AE54A]" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">
            {connected} integraç{connected === 1 ? "ão" : "ões"} disponív{connected === 1 ? "el" : "eis"}
          </div>
          <div className="text-xs text-[#6B9E6B]">Ative ou desative a qualquer momento</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {integrations.map((i) => (
          <IntegrationCard key={i.id} integration={i} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-[#6B9E6B]/60 text-center pt-2">
        Mais integrações chegando em breve — Stripe, Google Ads, OLX Motos e muito mais.
      </p>
    </div>
  );
}
