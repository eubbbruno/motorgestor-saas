"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BotIcon,
  CheckCheckIcon,
  CheckIcon,
  Loader2Icon,
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
import { cn } from "@/lib/utils";
import { WhatsAppEmbeddedSignup } from "@/components/whatsapp/embedded-signup";

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

type WaStatus = {
  configured: boolean;
  phone_number_id: string | null;
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

async function fetchStatus(): Promise<WaStatus> {
  const res = await fetch("/api/whatsapp/status");
  const data = await res.json();
  return { configured: data.configured ?? false, phone_number_id: data.phone_number_id ?? null };
}

async function fetchConversations(): Promise<WaConversation[]> {
  const res = await fetch("/api/whatsapp/conversations");
  const data = await res.json();
  return data.ok ? data.data : [];
}

async function fetchMessages(conversationId: string): Promise<WaMessage[]> {
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

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["wa", "status"],
    queryFn: fetchStatus,
    staleTime: 30000,
  });

  const isConfigured = statusData?.configured ?? false;

  const { data: conversations = [] } = useQuery({
    queryKey: ["wa", "conversations"],
    queryFn: fetchConversations,
    enabled: isConfigured,
    refetchInterval: isConfigured ? 5000 : false,
  });

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
  const selected = conversations.find(c => c.id === selectedId) ?? (filtered.length > 0 ? filtered[0] : null);

  const { data: messages = [] } = useQuery({
    queryKey: ["wa", "messages", selected?.id],
    queryFn: () => fetchMessages(selected!.id),
    enabled: !!selected && isConfigured,
    refetchInterval: 3000,
  });

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!selected) return;
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

  const resolveMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      await fetch(`/api/whatsapp/conversations/${selected.id}/resolve`, { method: "POST" });
    },
    onSuccess: () => {
      toast.success("Conversa marcada como resolvida.");
      qc.invalidateQueries({ queryKey: ["wa", "conversations"] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/companies/whatsapp-config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: "", phone_number_id: "" }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Erro ao desconectar.");
    },
    onSuccess: () => {
      toast.success("WhatsApp desconectado.");
      qc.invalidateQueries({ queryKey: ["wa", "status"] });
      qc.invalidateQueries({ queryKey: ["wa", "conversations"] });
    },
    onError: (err: Error) => toast.error("Falha ao desconectar.", { description: err.message }),
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

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (statusLoading) {
    return (
      <div
        className="flex rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] items-center justify-center"
        style={{ height: "calc(100vh - 9rem)" }}
      >
        <Loader2Icon className="size-6 animate-spin text-[#6B9E6B]/40" />
      </div>
    );
  }

  // ── Not connected: show Embedded Signup ───────────────────────────────────

  if (!isConfigured) {
    return (
      <div
        className="flex rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C]"
        style={{ height: "calc(100vh - 9rem)" }}
      >
        <WhatsAppEmbeddedSignup
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["wa", "status"] });
          }}
        />
      </div>
    );
  }

  // ── Connected: full inbox ─────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">
      {/* Connected badge */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/5 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-[#25D366]">
          <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="font-medium">WhatsApp Business conectado</span>
          {statusData?.phone_number_id && (
            <span className="text-[#25D366]/60 text-xs">· ID: {statusData.phone_number_id}</span>
          )}
        </div>
        <button
          onClick={() => disconnectMutation.mutate()}
          disabled={disconnectMutation.isPending}
          className="flex items-center gap-1.5 text-xs text-[#6B9E6B]/60 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {disconnectMutation.isPending
            ? <Loader2Icon className="size-3 animate-spin" />
            : <XCircleIcon className="size-3.5" />
          }
          Desconectar
        </button>
      </div>

      <div
        className="flex rounded-2xl overflow-hidden border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C]"
        style={{ height: "calc(100vh - 11rem)" }}
      >
        {/* ── Col 1: Conversation list ─────────────────────────────────────── */}
        <div className="flex w-[272px] shrink-0 flex-col border-r border-[rgba(74,229,74,0.08)]">
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
          </div>

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
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageCircleIcon className="size-8 text-[#6B9E6B]/30 mb-2" />
                <p className="text-xs text-[#6B9E6B]/50">
                  {conversations.length === 0
                    ? "Nenhuma conversa ainda. Aguardando a primeira mensagem."
                    : "Nenhuma conversa encontrada"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Col 2: Chat ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0">
          {selected ? (
            <>
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

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map(msg => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

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

        {/* ── Col 3: Contact info ──────────────────────────────────────────── */}
        <div className="flex w-[272px] shrink-0 flex-col border-l border-[rgba(74,229,74,0.08)]">
          {selected ? (
            <>
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
    </div>
  );
}
