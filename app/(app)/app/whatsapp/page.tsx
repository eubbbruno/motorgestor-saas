"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2Icon,
  CopyIcon,
  EditIcon,
  Loader2Icon,
  MessageCircleIcon,
  SendIcon,
  XCircleIcon,
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

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchConfig(): Promise<{ token: string; phone_number_id: string }> {
  const res = await fetch("/api/companies/whatsapp-config");
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "Erro ao buscar configuração.");
  return { token: data.token ?? "", phone_number_id: data.phone_number_id ?? "" };
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

async function testConnection(body: { token: string; phone_number_id: string }) {
  const res = await fetch("/api/whatsapp/test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<{ connected: boolean; display_name?: string; phone?: string; error?: string }>;
}

// ─── Config Section ───────────────────────────────────────────────────────────

function ConfigSection() {
  const qc = useQueryClient();
  const configQuery = useQuery({ queryKey: ["whatsapp", "config"], queryFn: fetchConfig, retry: false });
  const [token, setToken] = React.useState("");
  const [phoneId, setPhoneId] = React.useState("");
  const [testing, setTesting] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<{ connected: boolean; display_name?: string; error?: string } | null>(null);

  React.useEffect(() => {
    if (configQuery.data) {
      setToken(configQuery.data.token);
      setPhoneId(configQuery.data.phone_number_id);
    }
  }, [configQuery.data]);

  const saveMutation = useMutation({
    mutationFn: saveConfig,
    onSuccess: () => {
      toast.success("Configuração salva.");
      qc.invalidateQueries({ queryKey: ["whatsapp", "config"] });
    },
    onError: (err: Error) => toast.error("Não foi possível salvar.", { description: err.message }),
  });

  async function handleTest() {
    if (!token.trim() || !phoneId.trim()) {
      toast.error("Preencha o Token e o Phone Number ID antes de testar.");
      return;
    }
    setTesting(true);
    setConnectionStatus(null);
    try {
      const result = await testConnection({ token: token.trim(), phone_number_id: phoneId.trim() });
      setConnectionStatus(result);
      if (result.connected) toast.success(`Conectado: ${result.display_name}`);
      else toast.error("Conexão falhou.", { description: result.error });
    } finally {
      setTesting(false);
    }
  }

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">Configurar número</div>
          {connectionStatus && (
            <Badge className={connectionStatus.connected
              ? "border border-[#4AE54A]/20 bg-[#4AE54A]/10 text-[#4AE54A]"
              : "border border-red-500/20 bg-red-500/10 text-red-400"}>
              {connectionStatus.connected ? (
                <><CheckCircle2Icon className="mr-1 size-3" /> Conectado — {connectionStatus.display_name}</>
              ) : (
                <><XCircleIcon className="mr-1 size-3" /> Desconectado</>
              )}
            </Badge>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid gap-3 text-sm text-[#6B9E6B]">
            {[
              "Tenha um número WhatsApp Business aprovado pelo Meta",
              "Acesse developers.facebook.com e crie um App de negócios",
              "Cole o Token de acesso permanente e o Phone Number ID abaixo",
              "Clique em Testar conexão para verificar",
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
              variant="outline"
              size="sm"
              className="border-[rgba(74,229,74,0.2)] bg-transparent text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white"
              onClick={handleTest}
              disabled={testing}
            >
              {testing ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <MessageCircleIcon className="mr-1.5 size-3.5" />}
              Testar conexão
            </Button>
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
  const [sendPhone, setSendPhone] = React.useState("");
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
      </Card>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar mensagem teste</DialogTitle>
            <DialogDescription>Envie uma mensagem de teste para um número via WhatsApp Business.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Número (com DDI, ex: 5511999999999)</Label>
              <Input value={sendPhone} onChange={(e) => setSendPhone(e.target.value)} placeholder="5511999999999" />
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
            <div className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] p-3 text-xs text-[#6B9E6B]">
              {templates[sendTemplate].text}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>Cancelar</Button>
            <Button className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]" onClick={handleSendTest} disabled={sending}>
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

function HistorySection() {
  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="text-base font-medium">Histórico de mensagens</div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 py-10 text-center">
          <MessageCircleIcon className="size-10 text-[#6B9E6B]/30" />
          <div className="text-sm text-[#6B9E6B]/60">Nenhuma mensagem enviada ainda.</div>
          <div className="text-xs text-[#6B9E6B]/40">Configure e teste o WhatsApp acima para começar.</div>
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
      <ConfigSection />
      <TemplatesSection />
      <HistorySection />
    </div>
  );
}
