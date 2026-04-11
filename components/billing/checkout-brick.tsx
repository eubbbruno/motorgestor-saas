"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect } from "react";

export function CheckoutBrick({ preferenceId }: { preferenceId: string }) {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);
  }, []);

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
