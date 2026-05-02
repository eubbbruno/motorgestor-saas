"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCheckIcon,
  CheckIcon,
  CopyIcon,
  EditIcon,
  InfoIcon,
  Loader2Icon,
  MessageCircleIcon,
  PhoneIcon,
  SendIcon,
  SmartphoneIcon,
  WifiIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Templates ────────────────────────────────────────────────────────────────

const DEFAULT_TEMPLATES = [
  {
    id: "welcome",
    label: "Boas-vindas ao lead",
    text: "Olá {nome}! Vi que você tem interesse no {veiculo}. Sou {vendedor} da {concessionaria}. Posso te ajudar com mais informações?",
  },
  {
    id: "proposal",
    label: "Envio de proposta",
    text: "Olá {nome}! Segue a proposta do {veiculo} {ano} por R$ {preco}. Posso agendar um test drive para você?",
  },
  {
    id: "followup",
    label: "Follow-up",
    text: "Olá {nome}, tudo bem? Queria saber se ainda tem interesse no {veiculo}. Estamos com condições especiais essa semana!",
  },
];

// ─── Demo history data ────────────────────────────────────────────────────────

type ChatMessage = {
  id: string;
  from: "lead" | "seller";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
};

type Conversation = {
  id: string;
  leadName: string;
  phone: string;
  vehicle: string;
  avatar: string;
  messages: ChatMessage[];
};

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    leadName: "João Silva",
    phone: "+55 11 98765-4321",
    vehicle: "HB20 2023",
    avatar: "JS",
    messages: [
      { id: "m1", from: "lead", text: "Olá, vi o HB20 2023 no site, ainda está disponível?", time: "14:22" },
      { id: "m2", from: "seller", text: "Olá João! Sim, temos disponível. Posso te enviar mais detalhes?", time: "14:25", status: "read" },
      { id: "m3", from: "lead", text: "Sim por favor, qual o valor?", time: "14:26" },
      { id: "m4", from: "seller", text: "R$ 72.900. Posso agendar um test drive para você?", time: "14:28", status: "delivered" },
    ],
  },
  {
    id: "conv2",
    leadName: "Maria Santos",
    phone: "+55 21 97654-3210",
    vehicle: "Polo Track 2024",
    avatar: "MS",
    messages: [
      { id: "m5", from: "lead", text: "Tenho interesse no Polo Track", time: "11:05" },
      { id: "m6", from: "seller", text: "Olá Maria! Vi que você tem interesse no Polo Track. Sou Carlos da MotorGestor. Posso te ajudar com mais informações?", time: "11:07", status: "read" },
    ],
  },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchConfig(): Promise<{ ok: boolean; token: string; phone_number_id: string }> {
  const res = await fetch("/api/companies/whatsapp-config");
  return res.json();
}

async function saveConfig(body: { token: string; phone_number_id: string }) {
  const res = await fetch("/api/companies/whatsapp-config", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "Erro ao salvar.");
}

// ─── Status Card ──────────────────────────────────────────────────────────────

function StatusCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp", "config"],
    queryFn: fetchConfig,
  });

  const isConfigured = !isLoading && data?.ok && !!data.token && !!data.phone_number_id;

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: icon + info */}
          <div className="flex items-center gap-4">
            <div className={`relative flex size-14 items-center justify-center rounded-2xl border ${isConfigured ? "border-[#25D366]/30 bg-[#25D366]/10" : "border-[#6B9E6B]/20 bg-[#6B9E6B]/5"}`}>
              <SmartphoneIcon className={`size-7 ${isConfigured ? "text-[#25D366]" : "text-[#6B9E6B]"}`} />
              {isConfigured && (
                <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border-2 border-[#0A1A0C] bg-[#25D366]">
                  <WifiIcon className="size-2.5 text-white" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">WhatsApp Business</span>
                <Badge className={isConfigured
                  ? "border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-[10px]"
                  : "border border-[#6B9E6B]/20 bg-transparent text-[#6B9E6B] text-[10px]"
                }>
                  {isLoading ? "..." : isConfigured ? "Configurado" : "Não configurado"}
                </Badge>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6B9E6B]">
                {isConfigured ? (
                  <>
                    <PhoneIcon className="size-3" />
                    <span className="font-mono">Phone ID: {data!.phone_number_id}</span>
                  </>
                ) : (
                  <span>Configure seu número na seção abaixo para ativar</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: stats — zerados até integração real */}
          {isConfigured && (
            <div className="flex gap-6">
              {[
                { label: "Enviadas hoje", value: "0" },
                { label: "Conversas ativas", value: "0" },
                { label: "Taxa de resposta", value: "—" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-[#6B9E6B]/70">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </PremiumSurface>
  );
}

// ─── Config Section ───────────────────────────────────────────────────────────

function ConfigSection() {
  const qc = useQueryClient();
  const [token, setToken] = React.useState("");
  const [phoneId, setPhoneId] = React.useState("");

  const saveMutation = useMutation({
    mutationFn: saveConfig,
    onSuccess: () => {
      toast.success("Configuração salva.");
      qc.invalidateQueries({ queryKey: ["whatsapp", "config"] });
    },
    onError: (err: Error) => toast.error("Não foi possível salvar.", { description: err.message }),
  });

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="text-base font-medium">Configurar número</div>

        <div className="mt-5 space-y-4">
          <div className="grid gap-3 text-sm text-[#6B9E6B]">
            {[
              "Tenha um número WhatsApp Business aprovado pelo Meta",
              "Acesse developers.facebook.com e crie um App de negócios",
              "Cole o Token de acesso permanente e o Phone Number ID abaixo",
              "Clique em Salvar para ativar",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4AE54A]/10 text-[10px] font-bold text-[#4AE54A]">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6B9E6B]">Token de acesso</Label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="EAAxxxxxxxxxxxxxxx"
                className="border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white font-mono text-xs placeholder:text-[#6B9E6B]/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6B9E6B]">Phone Number ID</Label>
              <Input
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                placeholder="123456789012345"
                className="border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white font-mono text-xs placeholder:text-[#6B9E6B]/40"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
              onClick={() => saveMutation.mutate({ token: token.trim(), phone_number_id: phoneId.trim() })}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : null}
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </PremiumSurface>
  );
}

// ─── Templates Section ────────────────────────────────────────────────────────

function TemplatesSection() {
  const [templates, setTemplates] = React.useState(DEFAULT_TEMPLATES);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editText, setEditText] = React.useState("");
  const [sendOpen, setSendOpen] = React.useState(false);
  const [sendPhone, setSendPhone] = React.useState("5543996466446");
  const [sendTemplate, setSendTemplate] = React.useState(0);
  const [sending, setSending] = React.useState(false);

  async function copyTemplate(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  function saveEdit(idx: number) {
    setTemplates((prev) => prev.map((t, i) => (i === idx ? { ...t, text: editText } : t)));
    setEditIndex(null);
    toast.success("Template atualizado.");
  }

  async function handleSendTest() {
    if (!sendPhone.trim()) { toast.error("Informe o número."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: sendPhone.replace(/\D/g, ""), message: templates[sendTemplate].text }),
      });
      const data = await res.json();
      if (res.ok) { toast.success("Mensagem enviada."); setSendOpen(false); }
      else toast.error("Falha ao enviar.", { description: data.error ?? "Verifique as configurações." });
    } finally {
      setSending(false);
    }
  }

  // Preview with filled-in variables
  const previewText = templates[sendTemplate].text
    .replace("{nome}", "João Silva")
    .replace("{veiculo}", "HB20 2023")
    .replace("{ano}", "2023")
    .replace("{preco}", "72.900")
    .replace("{vendedor}", "Carlos")
    .replace("{concessionaria}", "MotorGestor");

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">Modelos de mensagem</div>
          <Button
            size="sm"
            variant="outline"
            className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white"
            onClick={() => setSendOpen(true)}
          >
            <SendIcon className="mr-1.5 size-3.5" />
            Enviar mensagem teste
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {templates.map((t, idx) => (
            <div key={t.id} className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold text-white">{t.label}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[#6B9E6B] hover:text-white" onClick={() => copyTemplate(t.text)}>
                    <CopyIcon className="size-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[#6B9E6B] hover:text-white" onClick={() => { setEditIndex(idx); setEditText(t.text); }}>
                    <EditIcon className="size-3" />
                  </Button>
                </div>
              </div>
              {editIndex === idx ? (
                <div className="space-y-2">
                  <Textarea
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white text-xs"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]" onClick={() => saveEdit(idx)}>Salvar</Button>
                    <Button size="sm" variant="outline" className="border-[rgba(74,229,74,0.2)] text-[#6B9E6B]" onClick={() => setEditIndex(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#6B9E6B] leading-relaxed">{t.text}</p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-[#6B9E6B]/60">
          Use <code className="text-[#4AE54A]">{"{nome}"}</code>, <code className="text-[#4AE54A]">{"{veiculo}"}</code>, <code className="text-[#4AE54A]">{"{preco}"}</code> etc. como variáveis dinâmicas.
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[rgba(74,229,74,0.1)] bg-[rgba(74,229,74,0.04)] px-4 py-3">
          <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-[#4AE54A]/50" />
          <p className="text-xs text-[#6B9E6B]">
            As mensagens são enviadas apenas para leads que demonstraram interesse nos seus veículos. Não enviamos spam ou mensagens em massa.
          </p>
        </div>
      </Card>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar mensagem teste</DialogTitle>
            <DialogDescription>Envie uma mensagem de teste para um número via WhatsApp Business.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Meta test number warning */}
            <div className="flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
              <span>
                Número de teste gratuito do Meta (<strong>+1 555 630 7621</strong>): o destinatário precisa estar na{" "}
                <strong>lista de números permitidos</strong> em{" "}
                <span className="font-mono">developers.facebook.com → WhatsApp → API Setup → To</span>.
                Será enviado o template <strong>hello_world</strong>.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Número destinatário (somente dígitos, com DDI)</Label>
              <Input
                value={sendPhone}
                onChange={(e) => setSendPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="5543996466446"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Template</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={sendTemplate}
                onChange={(e) => setSendTemplate(Number(e.target.value))}
              >
                {templates.map((t, i) => <option key={t.id} value={i}>{t.label}</option>)}
              </select>
            </div>
            {/* Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6B9E6B]">Prévia da mensagem</Label>
              <div className="rounded-xl border border-[rgba(74,229,74,0.15)] bg-[#0A1A0C] p-4">
                <div className="flex items-start gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[10px] font-bold text-[#25D366]">
                    MG
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl rounded-tl-sm bg-[#0F2014] border border-[rgba(74,229,74,0.12)] px-3 py-2">
                      <p className="text-xs text-white leading-relaxed">{previewText}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#6B9E6B]/50">
                      <span>agora</span>
                      <CheckCheckIcon className="size-3 text-[#25D366]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>Cancelar</Button>
            <Button className="bg-[#25D366] text-white hover:bg-[#1da851] font-semibold" onClick={handleSendTest} disabled={sending}>
              {sending ? <Loader2Icon className="mr-1.5 size-4 animate-spin" /> : <SendIcon className="mr-1.5 size-4" />}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PremiumSurface>
  );
}

// ─── History Section ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status?: "sent" | "delivered" | "read" }) {
  if (status === "read") return <CheckCheckIcon className="size-3.5 text-[#25D366]" />;
  if (status === "delivered") return <CheckCheckIcon className="size-3.5 text-[#6B9E6B]" />;
  return <CheckIcon className="size-3.5 text-[#6B9E6B]" />;
}

function ConversationCard({ conv }: { conv: Conversation }) {
  const last = conv.messages[conv.messages.length - 1];
  return (
    <div className="rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(74,229,74,0.08)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#4AE54A]/15 text-xs font-bold text-[#4AE54A]">
            {conv.avatar}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{conv.leadName}</div>
            <div className="text-[10px] text-[#6B9E6B]">{conv.phone} · {conv.vehicle}</div>
          </div>
        </div>
        <Badge className="border border-[#25D366]/20 bg-[#25D366]/10 text-[#25D366] text-[10px]">
          <MessageCircleIcon className="mr-1 size-2.5" />
          WhatsApp
        </Badge>
      </div>

      {/* Messages */}
      <div className="space-y-2 p-4">
        {conv.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "seller" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] ${msg.from === "seller" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
              <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.from === "seller"
                  ? "rounded-br-sm bg-[#25D366]/15 border border-[#25D366]/20 text-white"
                  : "rounded-bl-sm bg-[#0F2014] border border-[rgba(74,229,74,0.12)] text-white"
              }`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 px-1 text-[10px] text-[#6B9E6B]/50">
                <span>{msg.time}</span>
                {msg.from === "seller" && <StatusIcon status={msg.status} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(74,229,74,0.06)] px-4 py-2.5">
        <div className="flex items-center justify-between text-[10px] text-[#6B9E6B]/60">
          <span>Última mensagem: {last.time}</span>
          <div className="flex items-center gap-1">
            <StatusIcon status={last.status ?? "delivered"} />
            <span>{last.status === "read" ? "Lido" : "Entregue"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorySection() {
  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">Histórico de conversas</div>
          <Badge className="border border-[rgba(74,229,74,0.15)] bg-transparent text-[#6B9E6B] text-[10px]">
            {DEMO_CONVERSATIONS.length} conversas
          </Badge>
        </div>
        <div className="mt-4 space-y-4">
          {DEMO_CONVERSATIONS.map((conv) => (
            <ConversationCard key={conv.id} conv={conv} />
          ))}
        </div>
      </Card>
    </PremiumSurface>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhatsAppPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Comunicação"
        title="WhatsApp Business"
        description="Configure seu número e envie mensagens direto pelo painel."
      />
      <StatusCard />
      <TemplatesSection />
      <HistorySection />
      <ConfigSection />
    </div>
  );
}
