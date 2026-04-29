"use client";

import * as React from "react";
import { toast } from "sonner";
import { BotIcon, Loader2Icon, SendIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const QUICK_QUESTIONS = [
  "Como cadastrar um veículo?",
  "Como importar leads via CSV?",
  "Como configurar o WhatsApp?",
  "Como gerar relatórios?",
];

// ─── Bubble ───────────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex items-end gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border",
        isUser
          ? "border-[rgba(74,229,74,0.2)] bg-[#0A1A0C]"
          : "border-[#4AE54A]/30 bg-[#4AE54A]/10",
      )}>
        {isUser
          ? <UserIcon className="size-3.5 text-[#6B9E6B]" />
          : <BotIcon className="size-3.5 text-[#4AE54A]" />}
      </div>

      {/* Text */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
        isUser
          ? "rounded-br-sm bg-[#4AE54A] text-[#0A1A0C] font-medium"
          : "rounded-bl-sm border border-[rgba(74,229,74,0.12)] bg-[#0F2014] text-white",
      )}>
        {msg.text}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssistentePage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Olá! Sou o assistente do MotorGestor. Como posso te ajudar hoje?\n\nPosso te orientar sobre cadastro de veículos, CRM de leads, agenda, relatórios, WhatsApp e muito mais.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "IA indisponível.");
      }

      const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", text: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Tente novamente.";
      toast.error("Não foi possível obter resposta.", { description: message });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: "Desculpe, não consegui responder agora. Tente novamente em instantes." },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(74,229,74,0.08)] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-[#4AE54A]/30 bg-[#4AE54A]/10">
            <BotIcon className="size-5 text-[#4AE54A]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Assistente MotorGestor</div>
            <div className="text-[10px] text-[#6B9E6B]">Pergunte sobre qualquer funcionalidade do sistema</div>
          </div>
        </div>
        <Badge className="border border-[#4AE54A]/20 bg-[#4AE54A]/8 text-[#4AE54A] text-[10px]">
          Powered by Claude
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex items-end gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#4AE54A]/30 bg-[#4AE54A]/10">
              <BotIcon className="size-3.5 text-[#4AE54A]" />
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-[rgba(74,229,74,0.12)] bg-[#0F2014] px-4 py-3">
              <Loader2Icon className="size-4 animate-spin text-[#4AE54A]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="shrink-0 flex flex-wrap gap-2 px-6 pb-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="rounded-xl border border-[rgba(74,229,74,0.15)] bg-[#0F2014] px-3 py-1.5 text-xs text-[#6B9E6B] transition-colors hover:border-[#4AE54A]/30 hover:text-white disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-[rgba(74,229,74,0.08)] px-6 py-4">
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida… (Enter para enviar, Shift+Enter para nova linha)"
            rows={2}
            disabled={loading}
            className="resize-none border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white placeholder:text-[#6B9E6B]/40 focus-visible:ring-[#4AE54A]/30"
          />
          <Button
            className="shrink-0 bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
