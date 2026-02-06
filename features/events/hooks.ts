"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createEvent, deleteEvent, listEvents } from "@/features/events/api";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

