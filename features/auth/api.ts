"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { ProfileRow } from "@/types/models";

export async function fetchMyProfile(): Promise<ProfileRow> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Você precisa estar logado.");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, company_id, role, full_name, email, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

export async function updateMyProfile(values: { full_name?: string | null }): Promise<ProfileRow> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Você precisa estar logado.");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: values.full_name ?? null,
    })
    .eq("id", user.id)
    .select("id, company_id, role, full_name, email, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

