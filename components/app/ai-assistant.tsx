"use client";

import * as React from "react";
import { MessageCircleIcon, SendIcon, XIcon, Loader2Icon, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AiAssistant() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Olá! Sou o Assistente MotorGestor. Posso te ajudar com dúvidas sobre leads, veículos, negociações e estratégias de venda. Como posso ajudar?",
        },
      ]);
    }
  }, [open, messages.length]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadMessage: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Não foi possível obter resposta.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com o assistente. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir assistente IA"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#4AE54A] px-4 py-3 text-[#0A1A0C] font-bold text-sm shadow-[0_4px_24px_rgba(74,229,74,0.4)] hover:bg-[#3dd43d] hover:shadow-[0_4px_32px_rgba(74,229,74,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <MessageCircleIcon className="size-5" />
          IA
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[rgba(74,229,74,0.12)] bg-[#0A1A0C] shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:rounded-2xl sm:border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(74,229,74,0.1)] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#4AE54A]">
                <BotIcon className="size-4 text-[#0A1A0C]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Assistente MotorGestor</div>
                <div className="text-[10px] text-[#6B9E6B]">Powered by Claude AI</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Fechar assistente"
              className="text-[#6B9E6B] hover:text-white"
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={[
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-[#4AE54A] text-[#0A1A0C] font-medium"
                    : "bg-[#0F2014] text-[#D1FAD1] border border-[rgba(74,229,74,0.1)]",
                ].join(" ")}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex max-w-[85%] items-center gap-2 rounded-2xl border border-[rgba(74,229,74,0.1)] bg-[#0F2014] px-3 py-2">
                <Loader2Icon className="size-3 animate-spin text-[#4AE54A]" />
                <span className="text-xs text-[#6B9E6B]">Gerando resposta...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[rgba(74,229,74,0.1)] p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(74,229,74,0.15)] bg-[#0F2014] px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre leads, vendas..."
                className="flex-1 bg-transparent text-sm text-white placeholder-[#6B9E6B] outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Enviar mensagem"
                className="text-[#4AE54A] disabled:opacity-40 hover:text-[#3dd43d] transition-colors"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
