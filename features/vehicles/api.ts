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
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      company_id: args.companyId,
      created_by: args.userId,
      title: args.values.title,
      make: args.values.make ?? null,
      model: args.values.model ?? null,
      year: args.values.year ?? null,
      price: args.values.price ?? null,
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
  const { data, error } = await supabase
    .from("vehicles")
    .update({
      title: args.values.title,
      make: args.values.make ?? null,
      model: args.values.model ?? null,
      year: args.values.year ?? null,
      price: args.values.price ?? null,
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

