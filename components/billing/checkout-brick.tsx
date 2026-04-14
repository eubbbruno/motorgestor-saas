"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

if (MP_PUBLIC_KEY) {
  initMercadoPago(MP_PUBLIC_KEY);
}

export function CheckoutBrick({ preferenceId }: { preferenceId: string }) {
  if (!MP_PUBLIC_KEY) {
    console.error("[CheckoutBrick] NEXT_PUBLIC_MP_PUBLIC_KEY não configurada.");
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        Chave pública do Mercado Pago não configurada. Adicione{" "}
        <code>NEXT_PUBLIC_MP_PUBLIC_KEY</code> nas variáveis de ambiente.
      </div>
    );
  }

  return (
    <Payment
      initialization={{ amount: 0, preferenceId }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
        },
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
  );
}
