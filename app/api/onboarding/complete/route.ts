import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { sendWelcomeEmail } from "@/lib/email/send";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: false, error: "Supabase não configurado." }, { status: 500 });
  }

  const pendingCookies: Array<{
    name: string;
    value: string;
    options: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options });
        });
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  // Se já tem empresa, não faz nada
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.company_id) {
    return NextResponse.json({ ok: true, companyId: profile.company_id });
  }

  // Cria empresa padrão com slug único
  const emailPrefix =
    (user.email ?? "usuario")
      .split("@")[0]
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase()
      .slice(0, 20) || "empresa";
  const slug = `${emailPrefix}-${Date.now()}`;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ name: "Minha Empresa", slug, created_by: user.id })
    .select("id")
    .single();

  if (companyError || !company) {
    console.error("[onboarding/complete] companies.insert failed", companyError);
    return NextResponse.json(
      { ok: false, error: "Não foi possível criar empresa." },
      { status: 500 },
    );
  }

  // Nome amigável: user_metadata > email prefix
  const userName: string =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    emailPrefix;

  const { error: profileError } = await supabase.from("profiles").upsert(
    { id: user.id, company_id: company.id, role: "admin", email: user.email ?? null },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error("[onboarding/complete] profiles.upsert failed", profileError);
    return NextResponse.json(
      { ok: false, error: "Erro ao atualizar perfil." },
      { status: 500 },
    );
  }

  // Envia email de boas-vindas — fire and forget (não bloqueia a resposta)
  if (user.email) {
    sendWelcomeEmail(user.email, userName).catch(err =>
      console.error("[onboarding/complete] sendWelcomeEmail failed:", err)
    );
  }

  const res = NextResponse.json({ ok: true, companyId: company.id });
  pendingCookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
  return res;
}
