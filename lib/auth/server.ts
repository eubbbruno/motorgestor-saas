import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  company_id: string | null;
  role: "admin" | "vendedor";
  full_name: string | null;
  email: string | null;
};

export const getUserAndProfile = cache(async () => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { user: null, profile: null as Profile | null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null as Profile | null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, company_id, role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile as Profile | null) ?? null };
});

