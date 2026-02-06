"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLead, deleteLead, getLead, listLeads, updateLead } from "@/features/leads/api";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: listLeads,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLead(id),
    enabled: Boolean(id),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLead,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateLead,
    onSuccess: async (l) => {
      await qc.invalidateQueries({ queryKey: ["leads"] });
      await qc.invalidateQueries({ queryKey: ["leads", l.id] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

