import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";

const Schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase não configurado." },
      { status: 500 },
    );
  }

  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // SSR Auth: usa cookies do request/response (não depende de localStorage)
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const respondJson = (
    body: unknown,
    init?: Parameters<typeof NextResponse.json>[1],
  ) => {
    const res = NextResponse.json(body, init);
    pendingCookies.forEach(({ name, value, options }) => {
      res.cookies.set(name, value, options);
    });
    return res;
  };

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

  const { data: sessionData } = await supabase.auth.getSession();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[onboarding] unauthenticated", {
      hasSession: Boolean(sessionData?.session),
      userError: userError?.message,
    });
    return respondJson(
      {
        ok: false,
        error: "Sessão inválida. Faça login novamente.",
      },
      { status: 401 },
    );
  }

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    created_by: user.id, // explícito (não depende de default auth.uid())
  };

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert(payload)
    .select("id")
    .single();

  if (companyError || !company) {
    console.error("[onboarding] companies.insert failed", {
      userId: user.id,
      hasSession: Boolean(sessionData?.session),
      payload: { name: payload.name, slug: payload.slug },
      code: companyError?.code,
      message: companyError?.message,
      details: companyError?.details,
      hint: companyError?.hint,
    });
    return respondJson(
      {
        ok: false,
        error:
          "Não foi possível criar a empresa agora. Faça logout/login e tente novamente.",
      },
      { status: 403 },
    );
  }

  // Upsert garante que profile exista (insert self OU update self)
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      company_id: company.id,
      role: "admin",
      email: user.email ?? null,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error("[onboarding] profiles.upsert failed", {
      userId: user.id,
      companyId: company.id,
      hasSession: Boolean(sessionData?.session),
      code: profileError.code,
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
    });
    return respondJson(
      {
        ok: false,
        error:
          "Empresa criada, mas não foi possível finalizar seu perfil. Faça logout/login e tente novamente.",
      },
      { status: 403 },
    );
  }

  return respondJson({ ok: true, companyId: company.id });
}

