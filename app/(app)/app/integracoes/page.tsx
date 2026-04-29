"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BotIcon, CarIcon, FileTextIcon, MessageCircleIcon, SettingsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/app/page-header";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: React.ReactNode;
  action: React.ReactNode;
  expanded?: React.ReactNode;
};

// ─── Generic Card ─────────────────────────────────────────────────────────────

function IntegrationCard({ icon, title, description, badge, action, expanded }: CardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6 transition-all duration-200 hover:border-[rgba(74,229,74,0.22)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.18)] to-transparent" />

      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#4AE54A]/20 bg-[#4AE54A]/8">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white">{title}</span>
            {badge}
          </div>
          <p className="mt-1 text-xs text-[#6B9E6B] leading-relaxed">{description}</p>
        </div>
      </div>

      {expanded && <div className="mt-5">{expanded}</div>}

      <div className="mt-5 border-t border-[rgba(74,229,74,0.06)] pt-4">
        {action}
      </div>
    </div>
  );
}

// ─── Card 1: Consulta por Placa ───────────────────────────────────────────────

function PlacaCard() {
  const [active, setActive] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    if (!apiKey.trim()) { toast.error("Informe a API Key."); return; }
    setSaving(true);
    // Instrução para o usuário — key é configurada via Vercel env vars
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success("Configure no Vercel: VEHICLE_LOOKUP_PROVIDER=apiplacas e VEHICLE_LOOKUP_API_KEY=" + apiKey.trim().slice(0, 8) + "…");
  }

  return (
    <IntegrationCard
      icon={<CarIcon className="size-5 text-[#4AE54A]" />}
      title="Consulta por Placa"
      description="Digite a placa e preencha os dados do veículo automaticamente via APIPlacas."
      badge={
        <Badge className="border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-semibold">
          Plano Pro+
        </Badge>
      }
      expanded={
        active ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6B9E6B]">API Key — apiplacas.com.br</Label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua chave de API"
                className="border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white placeholder:text-[#6B9E6B]/50 focus-visible:ring-[#4AE54A]/30"
              />
            </div>
            <p className="text-[10px] text-[#6B9E6B]/70">
              Após salvar, adicione também ao Vercel: <code className="text-[#4AE54A]">VEHICLE_LOOKUP_PROVIDER=apiplacas</code>
            </p>
          </div>
        ) : null
      }
      action={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            role="switch"
            aria-checked={active}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors",
              active ? "border-[#4AE54A] bg-[#4AE54A]" : "border-[rgba(74,229,74,0.2)] bg-[#0A1A0C]",
            ].join(" ")}
          >
            <span className={["pointer-events-none inline-block size-4 rounded-full bg-white shadow transition-transform self-center", active ? "translate-x-5" : "translate-x-0.5"].join(" ")} />
          </button>
          <span className={`text-xs font-semibold ${active ? "text-[#4AE54A]" : "text-[#6B9E6B]/50"}`}>
            {active ? "Ativado" : "Desativado"}
          </span>
          {active && (
            <Button
              size="sm"
              className="ml-auto bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
              onClick={handleSave}
              disabled={saving}
            >
              <SettingsIcon className="mr-1.5 size-3.5" />
              {saving ? "Salvando…" : "Configurar"}
            </Button>
          )}
        </div>
      }
    />
  );
}

// ─── Card 2: WhatsApp Business ────────────────────────────────────────────────

function WhatsAppCard() {
  return (
    <IntegrationCard
      icon={<MessageCircleIcon className="size-5 text-[#25D366]" />}
      title="WhatsApp Business"
      description="Atenda leads e envie propostas direto pelo WhatsApp com templates prontos."
      badge={
        <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A] text-[10px] font-semibold">
          Configurar
        </Badge>
      }
      action={
        <Button asChild size="sm" className="bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20">
          <Link href="/app/whatsapp">
            <MessageCircleIcon className="mr-1.5 size-3.5" />
            Abrir configuração
          </Link>
        </Button>
      }
    />
  );
}

// ─── Card 3: Catálogo PDF ─────────────────────────────────────────────────────

function CatalogCard() {
  function handleGenerate() {
    window.open("/api/vehicles/catalog-pdf", "_blank");
  }

  return (
    <IntegrationCard
      icon={<FileTextIcon className="size-5 text-[#4AE54A]" />}
      title="Exportar Catálogo"
      description="Gere PDF do seu estoque para enviar aos marketplaces ou clientes manualmente."
      badge={
        <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A] text-[10px] font-semibold">
          Disponível
        </Badge>
      }
      action={
        <Button
          size="sm"
          className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
          onClick={handleGenerate}
        >
          <FileTextIcon className="mr-1.5 size-3.5" />
          Gerar PDF do Estoque
        </Button>
      }
    />
  );
}

// ─── Card 4: Assistente IA ────────────────────────────────────────────────────

function AssistanteCard() {
  const router = useRouter();
  return (
    <IntegrationCard
      icon={<BotIcon className="size-5 text-[#4AE54A]" />}
      title="Assistente IA"
      description="Tire dúvidas sobre o MotorGestor com inteligência artificial. Powered by Claude."
      badge={
        <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A] text-[10px] font-semibold">
          Disponível
        </Badge>
      }
      action={
        <Button
          size="sm"
          className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
          onClick={() => router.push("/app/assistente")}
        >
          <BotIcon className="mr-1.5 size-3.5" />
          Abrir Assistente
        </Button>
      }
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegracoesAppPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Ferramentas"
        title="Integrações"
        description="Conecte e automatize seu processo de vendas."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PlacaCard />
        <WhatsAppCard />
        <CatalogCard />
        <AssistanteCard />
      </div>
    </div>
  );
}
