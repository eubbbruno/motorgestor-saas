"use client";

import { useQuery } from "@tanstack/react-query";

import { listLeadWhatsAppHistory } from "@/features/leads/whatsapp-history-api";

export function useLeadWhatsAppHistory(leadId: string) {
  return useQuery({
    queryKey: ["leads", leadId, "whatsapp-history"],
    queryFn: () => listLeadWhatsAppHistory(leadId),
    enabled: Boolean(leadId),
  });
}

