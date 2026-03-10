"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLeadEvent, listLeadEvents } from "@/features/leads/events-api";

export function useLeadEvents(leadId: string) {
  return useQuery({
    queryKey: ["leads", leadId, "events"],
    queryFn: () => listLeadEvents(leadId),
    enabled: Boolean(leadId),
  });
}

export function useCreateLeadEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLeadEvent,
    onSuccess: async (event) => {
      await qc.invalidateQueries({ queryKey: ["leads", event.lead_id, "events"] });
    },
  });
}

