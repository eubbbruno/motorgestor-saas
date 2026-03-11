"use client";

export type WhatsAppHistoryEventRow = {
  id: string;
  lead_id: string;
  company_id: string;
  type: "whatsapp";
  message: string | null;
  created_by: string | null;
  created_at: string;
};

export async function listLeadWhatsAppHistory(leadId: string): Promise<WhatsAppHistoryEventRow[]> {
  const res = await fetch(`/api/leads/${leadId}/whatsapp-history`, { method: "GET" });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; events: WhatsAppHistoryEventRow[] }
    | { ok: false; error: string };

  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar histórico do WhatsApp.");
  }

  return json.events ?? [];
}

