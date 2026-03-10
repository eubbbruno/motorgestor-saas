"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { VehicleRow } from "@/types/models";
import type { VehicleFormValues } from "@/features/vehicles/schema";

export async function listVehicles(): Promise<VehicleRow[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as VehicleRow[];
}

export async function getVehicle(id: string): Promise<VehicleRow> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
  if (error) throw error;
  return data as VehicleRow;
}

export async function createVehicle(args: {
  values: VehicleFormValues;
  companyId: string;
  userId: string;
}): Promise<VehicleRow> {
  const supabase = createSupabaseBrowserClient();
  const hasFipe =
    args.values.fipe_value !== undefined ||
    args.values.fipe_reference !== undefined ||
    args.values.fipe_code !== undefined;
  const hasAi = args.values.description_ai !== undefined;
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      company_id: args.companyId,
      // created_by é opcional e tem FK para `profiles`.
      // Para não quebrar a criação caso o perfil ainda não exista em algum ambiente,
      // não enviamos `created_by` no insert.
      title: args.values.title,
      plate: (args.values.plate ?? "").trim() || null,
      chassis: (args.values.chassis ?? "").trim() || null,
      renavam: (args.values.renavam ?? "").trim() || null,
      make: args.values.make ?? null,
      model: args.values.model ?? null,
      version: (args.values.version ?? "").trim() || null,
      year: args.values.year ?? null,
      price: args.values.price ?? null,
      ...(hasFipe
        ? {
            fipe_value: args.values.fipe_value ?? null,
            fipe_reference: args.values.fipe_reference ?? null,
            fipe_code: args.values.fipe_code ?? null,
          }
        : {}),
      ...(hasAi ? { description_ai: args.values.description_ai ?? null } : {}),
      photo_paths: args.values.photo_paths ?? [],
      mileage: args.values.mileage ?? null,
      fuel: args.values.fuel ?? null,
      transmission: args.values.transmission ?? null,
      color: args.values.color ?? null,
      status: args.values.status,
      notes: args.values.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as VehicleRow;
}

export async function updateVehicle(args: {
  id: string;
  values: VehicleFormValues;
}): Promise<VehicleRow> {
  const supabase = createSupabaseBrowserClient();
  const hasFipe =
    args.values.fipe_value !== undefined ||
    args.values.fipe_reference !== undefined ||
    args.values.fipe_code !== undefined;
  const hasAi = args.values.description_ai !== undefined;
  const { data, error } = await supabase
    .from("vehicles")
    .update({
      title: args.values.title,
      plate: (args.values.plate ?? "").trim() || null,
      chassis: (args.values.chassis ?? "").trim() || null,
      renavam: (args.values.renavam ?? "").trim() || null,
      make: args.values.make ?? null,
      model: args.values.model ?? null,
      version: (args.values.version ?? "").trim() || null,
      year: args.values.year ?? null,
      price: args.values.price ?? null,
      ...(hasFipe
        ? {
            fipe_value: args.values.fipe_value ?? null,
            fipe_reference: args.values.fipe_reference ?? null,
            fipe_code: args.values.fipe_code ?? null,
          }
        : {}),
      ...(hasAi ? { description_ai: args.values.description_ai ?? null } : {}),
      photo_paths: args.values.photo_paths ?? [],
      mileage: args.values.mileage ?? null,
      fuel: args.values.fuel ?? null,
      transmission: args.values.transmission ?? null,
      color: args.values.color ?? null,
      status: args.values.status,
      notes: args.values.notes ?? null,
    })
    .eq("id", args.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as VehicleRow;
}

export async function deleteVehicle(id: string): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

