"use client";

export type LeadEventType =
  | "created"
  | "note"
  | "status_change"
  | "call"
  | "visit"
  | "sale";

export type LeadEventRow = {
  id: string;
  lead_id: string;
  company_id: string;
  type: LeadEventType;
  message: string | null;
  created_by: string | null;
  created_at: string;
};

export async function listLeadEvents(leadId: string): Promise<LeadEventRow[]> {
  const res = await fetch(`/api/leads/${leadId}/events`, { method: "GET" });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; events: LeadEventRow[] }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar timeline.");
  }
  return json.events ?? [];
}

export async function createLeadEvent(args: {
  leadId: string;
  type: LeadEventType;
  message?: string | null;
}): Promise<LeadEventRow> {
  const res = await fetch(`/api/leads/${args.leadId}/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: args.type, message: args.message ?? null }),
  });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; event: LeadEventRow }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao salvar evento.");
  }
  return json.event;
}

