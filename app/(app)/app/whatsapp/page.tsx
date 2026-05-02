"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BotIcon,
  CheckCheckIcon,
  CheckIcon,
  MessageCircleIcon,
  PauseIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SmartphoneIcon,
  UserPlusIcon,
  WifiIcon,
  XCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type WaConversation = {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
  status: "open" | "resolved" | "waiting";
};

type WaMessage = {
  id: string;
  direction: "inbound" | "outbound";
  message: string;
  sent_by: "ai" | "human";
  created_at: string;
};

// ─── Demo data (shown when no real conversations exist yet) ───────────────────

const DEMO_CONVERSATIONS: WaConversation[] = [
  {
    id: "demo1",
    contact_phone: "5511987654321",
    contact_name: "João Silva",
    last_message: "R$ 72.900. Posso agendar um test drive para você?",
    last_message_at: new Date(Date.now() - 3 * 60000).toISOString(),
    unread_count: 0,
    status: "open",
  },
  {
    id: "demo2",
    contact_phone: "5521976543210",
    contact_name: "Maria Santos",
    last_message: "Olá Maria! Vi que você tem interesse no Polo Track.",
    last_message_at: new Date(Date.now() - 45 * 60000).toISOString(),
    unread_count: 2,
    status: "open",
  },
  {
    id: "demo3",
    contact_phone: "5531965432109",
    contact_name: null,
    last_message: "Obrigado! Entrarei em contato amanhã.",
    last_message_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    unread_count: 0,
    status: "resolved",
  },
];

const DEMO_MESSAGES: Record<string, WaMessage[]> = {
  demo1: [
    { id: "m1", direction: "inbound", message: "Olá, vi o HB20 2023 no site, ainda está disponível?", sent_by: "human", created_at: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: "m2", direction: "outbound", message: "Olá João! Sim, temos disponível 😊 Posso te enviar mais detalhes?", sent_by: "ai", created_at: new Date(Date.now() - 22 * 60000).toISOString() },
    { id: "m3", direction: "inbound", message: "Sim por favor, qual o valor?", sent_by: "human", created_at: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: "m4", direction: "outbound", message: "R$ 72.900. Posso agendar um test drive para você? 🚗", sent_by: "ai", created_at: new Date(Date.now() - 3 * 60000).toISOString() },
  ],
  demo2: [
    { id: "m5", direction: "inbound", message: "Tenho interesse no Polo Track", sent_by: "human", created_at: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: "m6", direction: "outbound", message: "Olá Maria! Vi que você tem interesse no Polo Track. Sou Carlos da MotorGestor. Posso te ajudar com mais informações? 😊", sent_by: "ai", created_at: new Date(Date.now() - 45 * 60000).toISOString() },
  ],
  demo3: [
    { id: "m7", direction: "inbound", message: "Boa tarde, quero saber sobre financiamento", sent_by: "human", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "m8", direction: "outbound", message: "Boa tarde! Trabalhamos com vários bancos parceiros 😊 Me conta qual veículo você se interessou?", sent_by: "ai", created_at: new Date(Date.now() - 4.5 * 3600000).toISOString() },
    { id: "m9", direction: "inbound", message: "Obrigado! Entrarei em contato amanhã.", sent_by: "human", created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string | null, phone: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return phone.slice(-2);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 13) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 12) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 8)}-${d.slice(8)}`;
  return phone;
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchConversations(): Promise<WaConversation[]> {
  const res = await fetch("/api/whatsapp/conversations");
  const data = await res.json();
  return data.ok ? data.data : [];
}

async function fetchMessages(conversationId: string): Promise<WaMessage[]> {
  if (conversationId.startsWith("demo")) return DEMO_MESSAGES[conversationId] ?? [];
  const res = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`);
  const data = await res.json();
  return data.ok ? data.data : [];
}

// ─── Conversation Item ─────────────────────────────────────────────────────────

function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: WaConversation;
  active: boolean;
  onClick: () => void;
}) {
  const ini = initials(conv.contact_name, conv.contact_phone);
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors",
        active ? "bg-[rgba(74,229,74,0.12)]" : "hover:bg-[rgba(74,229,74,0.05)]"
      )}
    >
      <div className="relative shrink-0">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#4AE54A]/15 text-xs font-bold text-[#4AE54A]">
          {ini}
        </div>
        {conv.status === "open" && (
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#25D366] border-2 border-[#0A1A0C]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-white truncate">
            {conv.contact_name ?? formatPhone(conv.contact_phone)}
          </span>
          <span className="text-[10px] text-[#6B9E6B]/60 shrink-0">
            {formatTime(conv.last_message_at)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-[11px] text-[#6B9E6B] truncate">{conv.last_message ?? ""}</p>
          {conv.unread_count > 0 && (
            <span className="shrink-0 flex size-4 items-center justify-center rounded-full bg-[#25D366] text-[9px] font-bold text-white">
              {conv.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Chat Message ─────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: WaMessage }) {
  const isOut = msg.direction === "outbound";
  return (
    <div className={cn("flex", isOut ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] flex flex-col gap-0.5", isOut ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-xs leading-relaxed",
            isOut
              ? "rounded-br-sm bg-[#4AE54A] text-[#0A1A0C] font-medium"
              : "rounded-bl-sm bg-[#0F2014] border border-[rgba(74,229,74,0.12)] text-white"
          )}
        >
          {msg.message}
        </div>
        <div className="flex items-center gap-1 px-1 text-[10px] text-[#6B9E6B]/50">
          <span>{new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
          {isOut && msg.sent_by === "ai" && (
            <span className="flex items-center gap-0.5 text-[#4AE54A]/70">
              <BotIcon className="size-2.5" />
              <span>IA</span>
            </span>
          )}
          {isOut && <CheckCheckIcon className="size-3 text-[#6B9E6B]" />}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WhatsAppPage() {
  const qc = useQueryClient();

  const [tab, setTab] = React.useState<"open" | "resolved" | "all">("open");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [aiPaused, setAiPaused] = React.useState(false);
  const [messageInput, setMessageInput] = React.useState("");
  const [note, setNote] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Real conversations — poll every 5s
  const { data: realConversations = [] } = useQuery({
    queryKey: ["wa", "conversations"],
    queryFn: fetchConversations,
    refetchInterval: 5000,
  });

  const conversations = realConversations.length > 0 ? realConversations : DEMO_CONVERSATIONS;
  const isDemo = realConversations.length === 0;

  const filtered = conversations.filter(c => {
    const matchTab =
      tab === "all" ? true :
      tab === "open" ? c.status === "open" :
      c.status === "resolved";
    const matchSearch =
      !search ||
      (c.contact_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      c.contact_phone.includes(search);
    return matchTab && matchSearch;
  });

  const openCount = conversations.filter(c => c.status === "open").length;
  const selected = conversations.find(c => c.id === selectedId) ?? filtered[0] ?? null;

  // Messages for selected conversation — poll every 3s
  const { data: messages = [] } = useQuery({
    queryKey: ["wa", "messages", selected?.id],
    queryFn: () => fetchMessages(selected!.id),
    enabled: !!selected,
    refetchInterval: 3000,
  });

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!selected || isDemo) {
        toast.info("Modo demonstração — conecte o WhatsApp para enviar.");
        return;
      }
      const res = await fetch(`/api/whatsapp/conversations/${selected.id}/send`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Erro ao enviar.");
    },
    onSuccess: () => {
      setMessageInput("");
      qc.invalidateQueries({ queryKey: ["wa", "messages", selected?.id] });
      qc.invalidateQueries({ queryKey: ["wa", "conversations"] });
    },
    onError: (err: Error) => toast.error("Falha ao enviar.", { description: err.message }),
  });

  // Resolve mutation
  const resolveMutation = useMutation({
    mutationFn: async () => {
      if (!selected || isDemo) { toast.info("Modo demonstração."); return; }
      await fetch(`/api/whatsapp/conversations/${selected.id}/resolve`, { method: "POST" });
    },
    onSuccess: () => {
      toast.success("Conversa marcada como resolvida.");
      qc.invalidateQueries({ queryKey: ["wa", "conversations"] });
    },
  });

  function handleSend() {
    const msg = messageInput.trim();
    if (!msg) return;
    sendMutation.mutate(msg);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const ini = selected ? initials(selected.contact_name, selected.contact_phone) : "";

  return (
    <div
      className="flex rounded-2xl overflow-hidden border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C]"
      style={{ height: "calc(100vh - 9rem)" }}
    >
      {/* ── Col 1: Conversation list ───────────────────────────────────────── */}
      <div className="flex w-[272px] shrink-0 flex-col border-r border-[rgba(74,229,74,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(74,229,74,0.08)] px-4 py-3">
          <div className="flex items-center gap-2">
            <SmartphoneIcon className="size-4 text-[#25D366]" />
            <span className="text-sm font-semibold text-white">Inbox</span>
            {openCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#25D366] text-[9px] font-bold text-white">
                {openCount}
              </span>
            )}
          </div>
          {isDemo && (
            <span className="text-[9px] text-amber-400/70 border border-amber-400/20 rounded px-1.5 py-0.5">demo</span>
          )}
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[rgba(74,229,74,0.06)]">
          <div className="flex items-center gap-2 rounded-lg bg-[rgba(74,229,74,0.06)] px-2.5 py-1.5">
            <SearchIcon className="size-3.5 text-[#6B9E6B]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar contato..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-[#6B9E6B]/50 outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(74,229,74,0.06)]">
          {(["open", "resolved", "all"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-medium transition-colors",
                tab === t ? "text-[#4AE54A] border-b-2 border-[#4AE54A]" : "text-[#6B9E6B]/60 hover:text-[#6B9E6B]"
              )}
            >
              {t === "open" ? "Abertas" : t === "resolved" ? "Resolvidas" : "Todas"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.map(conv => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={selected?.id === conv.id}
              onClick={() => setSelectedId(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircleIcon className="size-8 text-[#6B9E6B]/30 mb-2" />
              <p className="text-xs text-[#6B9E6B]/50">Nenhuma conversa encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Col 2: Chat ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {selected ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-[rgba(74,229,74,0.08)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#4AE54A]/15 text-xs font-bold text-[#4AE54A]">
                  {ini}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {selected.contact_name ?? formatPhone(selected.contact_phone)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#6B9E6B]">
                    <WifiIcon className="size-2.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                    <span className="text-[#6B9E6B]/30">·</span>
                    <span>{formatPhone(selected.contact_phone)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* AI toggle */}
                <button
                  onClick={() => setAiPaused(p => !p)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                    aiPaused
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366]"
                  )}
                >
                  {aiPaused ? (
                    <><PauseIcon className="size-3" /> IA pausada</>
                  ) : (
                    <><PlayIcon className="size-3" /> IA ativa</>
                  )}
                </button>
                {selected.status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white text-xs"
                    onClick={() => resolveMutation.mutate()}
                    disabled={resolveMutation.isPending}
                  >
                    <CheckIcon className="mr-1 size-3" />
                    Resolver
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map(msg => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
              {/* Typing indicator when AI is processing */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[rgba(74,229,74,0.08)] px-4 py-3">
              {aiPaused && (
                <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-400/80">
                  <PauseIcon className="size-3" />
                  <span>IA pausada — você está respondendo manualmente</span>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite uma mensagem... (Enter para enviar)"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.05)] px-3 py-2 text-xs text-white placeholder:text-[#6B9E6B]/40 outline-none focus:border-[rgba(74,229,74,0.4)] transition-colors"
                  style={{ maxHeight: "80px" }}
                />
                <Button
                  size="sm"
                  className="shrink-0 bg-[#25D366] text-white hover:bg-[#1da851] h-8 px-3"
                  onClick={handleSend}
                  disabled={sendMutation.isPending || !messageInput.trim()}
                >
                  <SendIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <MessageCircleIcon className="size-12 text-[#6B9E6B]/20" />
            <p className="text-sm text-[#6B9E6B]/50">Selecione uma conversa</p>
          </div>
        )}
      </div>

      {/* ── Col 3: Contact info ─────────────────────────────────────────────── */}
      <div className="flex w-[272px] shrink-0 flex-col border-l border-[rgba(74,229,74,0.08)]">
        {selected ? (
          <>
            {/* Avatar + info */}
            <div className="flex flex-col items-center border-b border-[rgba(74,229,74,0.08)] px-4 py-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#4AE54A]/15 text-xl font-bold text-[#4AE54A] mb-3">
                {ini}
              </div>
              <div className="text-sm font-semibold text-white">
                {selected.contact_name ?? "Contato"}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6B9E6B]">
                <PhoneIcon className="size-3" />
                <span>{formatPhone(selected.contact_phone)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Badge
                  className={cn(
                    "text-[10px] border",
                    selected.status === "open"
                      ? "border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366]"
                      : "border-[#6B9E6B]/20 bg-transparent text-[#6B9E6B]"
                  )}
                >
                  {selected.status === "open" ? "Aberta" : "Resolvida"}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 border-b border-[rgba(74,229,74,0.08)] px-4 py-4">
              <Button
                size="sm"
                className="w-full bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold text-xs"
                onClick={() => toast.info("Abrindo formulário de lead...")}
              >
                <UserPlusIcon className="mr-1.5 size-3.5" />
                Criar lead no CRM
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white text-xs"
                onClick={() => toast.info("Em breve.")}
              >
                <PlusIcon className="mr-1.5 size-3.5" />
                Vincular lead existente
              </Button>
            </div>

            {/* AI status */}
            <div className="border-b border-[rgba(74,229,74,0.08)] px-4 py-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B9E6B]/50">
                Automação
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#6B9E6B]">
                  <BotIcon className="size-3.5" />
                  <span>IA para este contato</span>
                </div>
                <button
                  onClick={() => setAiPaused(p => !p)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    aiPaused ? "bg-[#6B9E6B]/20" : "bg-[#25D366]"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      aiPaused ? "translate-x-0.5" : "translate-x-4"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Internal note */}
            <div className="flex-1 px-4 py-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B9E6B]/50">
                Nota interna
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Adicione uma nota sobre este contato..."
                className="w-full h-24 resize-none rounded-xl border border-[rgba(74,229,74,0.15)] bg-[rgba(74,229,74,0.04)] px-3 py-2 text-xs text-[#6B9E6B] placeholder:text-[#6B9E6B]/30 outline-none focus:border-[rgba(74,229,74,0.3)] transition-colors"
              />
              <p className="mt-1.5 text-[9px] text-[#6B9E6B]/40">Visível apenas para a equipe</p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xs text-[#6B9E6B]/40 text-center px-4">
              Selecione uma conversa para ver o contato
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
