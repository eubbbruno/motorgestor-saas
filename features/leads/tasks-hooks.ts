"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLeadTask, deleteTask, listLeadTasks, patchTask } from "@/features/leads/tasks-api";

export function useLeadTasks(leadId: string) {
  return useQuery({
    queryKey: ["leads", leadId, "tasks"],
    queryFn: () => listLeadTasks(leadId),
    enabled: Boolean(leadId),
  });
}

export function useCreateLeadTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLeadTask,
    onSuccess: async (task) => {
      await qc.invalidateQueries({ queryKey: ["leads", task.lead_id, "tasks"] });
    },
  });
}

export function usePatchTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchTask,
    onSuccess: async (task) => {
      await qc.invalidateQueries({ queryKey: ["leads", task.lead_id, "tasks"] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

