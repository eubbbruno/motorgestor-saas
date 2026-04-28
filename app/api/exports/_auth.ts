import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { VehicleRow } from "@/types/models";

/**
 * Resolve o company_id a partir de:
 *  1. ?token=xxx  → lookup por export_token (requer SUPABASE_SERVICE_ROLE_KEY)
 *  2. Sessão autenticada  → company_id do perfil
 *
 * Retorna { companyId, supabase } em caso de sucesso,
 * ou { error, status } em caso de falha.
 */
export async function resolveExportAuth(req: NextRequest): Promise<
  | { companyId: string; supabase: ReturnType<typeof createServerClient> }
  | { error: string; status: number }
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const token = new URL(req.url).searchParams.get("token");

  // ── Caminho 1: token de export ──────────────────────────────────────────
  if (token) {
    if (!serviceKey) {
      return {
        error: "SUPABASE_SERVICE_ROLE_KEY não configurada — acesso via token desabilitado.",
        status: 503,
      };
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: company, error } = await admin
      .from("companies")
      .select("id")
      .eq("export_token", token)
      .single();

    if (error || !company) {
      return { error: "Token inválido ou empresa não encontrada.", status: 401 };
    }

    // Retorna um supabase client com a sessão do service role para buscar veículos
    const supabase = createServerClient(supabaseUrl, serviceKey, {
      cookies: { getAll: () => [], setAll: () => {} },
    });

    return { companyId: company.id as string, supabase };
  }

  // ── Caminho 2: sessão autenticada ───────────────────────────────────────
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Não autenticado.", status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.company_id) {
    return { error: "Empresa não encontrada para este usuário.", status: 403 };
  }

  return { companyId: profile.company_id as string, supabase };
}

/** Busca todos os veículos exportáveis (disponível ou reservado) de uma empresa. */
export async function fetchVehiclesForExport(
  supabase: ReturnType<typeof createServerClient>,
  companyId: string,
): Promise<VehicleRow[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("company_id", companyId)
    .in("status", ["disponivel", "reservado"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as VehicleRow[];
}
