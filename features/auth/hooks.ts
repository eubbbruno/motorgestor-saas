"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMyProfile, updateMyProfile } from "@/features/auth/api";

export function useMyProfile() {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: fetchMyProfile,
  });
}

export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me", "profile"] });
    },
  });
}

