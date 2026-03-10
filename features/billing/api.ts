"use client";

export type BillingSummary = {
  plan: {
    name: string;
    price: number;
    max_vehicles: number;
    max_leads: number;
    ai_enabled: boolean;
  };
  usage: {
    vehicles: number;
    leads: number;
  };
};

export async function fetchBillingSummary(): Promise<BillingSummary> {
  const res = await fetch("/api/billing/summary", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });

  const json = (await res.json().catch(() => null)) as
    | ({ ok: true } & BillingSummary)
    | { ok: false; error: string };

  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar billing.");
  }

  return { plan: json.plan, usage: json.usage };
}

