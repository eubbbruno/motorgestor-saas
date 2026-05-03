"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { AlertCircle, Loader2 } from "lucide-react";

// Em produção usa a chave de produção; em dev usa a chave de teste.
// Configure no Vercel:
//   NEXT_PUBLIC_MP_PUBLIC_KEY      → chave pública de PRODUÇÃO
//   NEXT_PUBLIC_MP_PUBLIC_KEY_TEST → chave pública de TESTE
const MP_PUBLIC_KEY =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    : (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY_TEST ?? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);

interface CheckoutBrickProps {
  preferenceId: string;
  amount: number;
}

export function CheckoutBrick({ preferenceId, amount }: CheckoutBrickProps) {
  const [initialized, setInitialized] = useState(false);
  const [ready, setReady] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);

  useEffect(() => {
    if (!MP_PUBLIC_KEY) return;
    // Inicializa uma única vez por sessão
    initMercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
    setInitialized(true);
  }, []);

  if (!MP_PUBLIC_KEY) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="size-4 shrink-0" />
          Chave pública do Mercado Pago não configurada.
        </div>
        <p className="mt-1 text-red-400/70">
          Adicione <code className="font-mono">NEXT_PUBLIC_MP_PUBLIC_KEY</code>{" "}
          (produção) ou <code className="font-mono">NEXT_PUBLIC_MP_PUBLIC_KEY_TEST</code>{" "}
          (teste) nas variáveis de ambiente e faça redeploy.
        </p>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-mg-fg-muted">
        <Loader2 className="size-4 animate-spin" />
        Inicializando Mercado Pago…
      </div>
    );
  }

  return (
    <div className="relative">
      {!ready && !mpError && (
        <div className="flex items-center gap-2 py-8 text-sm text-mg-fg-muted">
          <Loader2 className="size-4 animate-spin" />
          Carregando formulário de pagamento…
        </div>
      )}

      {mpError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="size-4 shrink-0" />
            Erro ao carregar o Mercado Pago
          </div>
          <p className="mt-1 font-mono text-xs text-red-400/70">{mpError}</p>
          <p className="mt-2 text-red-400/70">
            Verifique se a Public Key e o Access Token são do mesmo ambiente (teste ou produção).
          </p>
        </div>
      )}

      <div className={mpError ? "hidden" : undefined}>
        <Payment
          initialization={{ amount, preferenceId }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
            },
          }}
          onReady={() => setReady(true)}
          onError={(err) => {
            const msg =
              typeof err === "object" && err !== null
                ? JSON.stringify(err)
                : String(err);
            console.error("[CheckoutBrick] MP SDK error:", err);
            setMpError(msg);
          }}
          onSubmit={async ({ formData }) => {
            const res = await fetch("/api/billing/process-payment", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.status === "approved") {
              window.location.href = "/app/dashboard?payment=success";
            } else {
              window.location.href = "/app/billing?payment=error";
            }
          }}
        />
      </div>
    </div>
  );
}
