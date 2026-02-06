"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { EventRow } from "@/types/models";
import type { EventFormValues } from "@/features/events/schema";

export async function listEvents(): Promise<EventRow[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventRow[];
}

export async function createEvent(args: {
  values: EventFormValues;
  companyId: string;
  userId: string;
}): Promise<EventRow> {
  const supabase = createSupabaseBrowserClient();
  const leadId = args.values.lead_id && args.values.lead_id.length > 0 ? args.values.lead_id : null;

  const { data, error } = await supabase
    .from("events")
    .insert({
      company_id: args.companyId,
      created_by: args.userId,
      lead_id: leadId,
      title: args.values.title,
      start_at: args.values.start_at,
      end_at: args.values.end_at && args.values.end_at.length > 0 ? args.values.end_at : null,
      location: args.values.location ?? null,
      notes: args.values.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as EventRow;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

