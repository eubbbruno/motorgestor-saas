import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/cadastro"];

// Rotas do /app que não exigem subscription ativa (billing e onboarding sempre acessíveis)
const BILLING_EXEMPT = ["/app/billing", "/app/onboarding"];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem env, não bloqueia build/local
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isApp = pathname === "/app" || pathname.startsWith("/app/");
  const isAuthRoute = AUTH_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Não autenticado tentando acessar /app → login
  if (isApp && !user) {
    const redirectTo = `${pathname}${request.nextUrl.search}`;
    url.pathname = "/login";
    url.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(url);
  }

  // Autenticado em rota de auth → /app
  if (isAuthRoute && user) {
    url.pathname = "/app";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isApp && user) {
    const isBillingExempt = BILLING_EXEMPT.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    // Busca perfil com company_id e trial_ends_at
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id, trial_ends_at")
      .eq("id", user.id)
      .maybeSingle();

    // Sem company_id → onboarding
    if (!profile?.company_id) {
      if (!pathname.startsWith("/app/onboarding")) {
        url.pathname = "/app/onboarding";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Verifica subscription ativa
    if (!isBillingExempt) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("company_id", profile.company_id)
        .in("status", ["active", "trialing"])
        .maybeSingle();

      const hasActiveSub = !!subscription;

      if (!hasActiveSub) {
        // Verifica trial
        const trialEnd = profile.trial_ends_at
          ? new Date(profile.trial_ends_at)
          : null;
        const trialActive = trialEnd ? trialEnd > new Date() : false;

        if (!trialActive) {
          url.pathname = "/app/billing";
          url.search = "";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
