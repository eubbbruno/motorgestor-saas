"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
} from "@/features/vehicles/api";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicle(id),
    enabled: Boolean(id),
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: async (v) => {
      await qc.invalidateQueries({ queryKey: ["vehicles"] });
      await qc.invalidateQueries({ queryKey: ["vehicles", v.id] });
    },
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

