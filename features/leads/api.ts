"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { LeadRow } from "@/types/models";
import type { LeadFormValues } from "@/features/leads/schema";

export async function listLeads(): Promise<LeadRow[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LeadRow[];
}

export async function getLead(id: string): Promise<LeadRow> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error) throw error;
  return data as LeadRow;
}

export async function createLead(args: {
  values: LeadFormValues;
  companyId: string;
  userId: string;
}): Promise<LeadRow> {
  const supabase = createSupabaseBrowserClient();
  const vehicleId =
    args.values.vehicle_id && args.values.vehicle_id.length > 0
      ? args.values.vehicle_id
      : null;

  const email = args.values.email && args.values.email.length > 0 ? args.values.email : null;

  const { data, error } = await supabase
    .from("leads")
    .insert({
      company_id: args.companyId,
      created_by: args.userId,
      name: args.values.name,
      phone: args.values.phone ?? null,
      email,
      source: args.values.source ?? null,
      status: args.values.status,
      vehicle_id: vehicleId,
      notes: args.values.notes ?? null,
      last_contact_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as LeadRow;
}

export async function updateLead(args: { id: string; values: LeadFormValues }): Promise<LeadRow> {
  const supabase = createSupabaseBrowserClient();
  const vehicleId = args.values.vehicle_id && args.values.vehicle_id.length > 0 ? args.values.vehicle_id : null;
  const email = args.values.email && args.values.email.length > 0 ? args.values.email : null;

  const { data, error } = await supabase
    .from("leads")
    .update({
      name: args.values.name,
      phone: args.values.phone ?? null,
      email,
      source: args.values.source ?? null,
      status: args.values.status,
      vehicle_id: vehicleId,
      notes: args.values.notes ?? null,
    })
    .eq("id", args.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as LeadRow;
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

