import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/cadastro"];
const ONBOARDING_ALLOWLIST = [
  "/app/onboarding",
  "/app/veiculos/novo",
  "/app/leads/novo",
  "/app/pipeline",
  "/app/importar-leads",
];

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
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isApp && !user) {
    const redirectTo = `${pathname}${request.nextUrl.search}`;
    url.pathname = "/login";
    url.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    url.pathname = "/app";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Onboarding: perfil sem company_id vai para /app/onboarding
  if (isApp && user && !pathname.startsWith("/app/onboarding")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.company_id) {
      url.pathname = "/app/onboarding";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Onboarding guiado: se a empresa ainda não tem veículos OU leads, força /app/onboarding
  if (isApp && user) {
    const allowed = ONBOARDING_ALLOWLIST.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

    if (!allowed) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .maybeSingle();

      const companyId = profile?.company_id ?? null;
      if (companyId) {
        const [{ count: vehiclesCount }, { count: leadsCount }] = await Promise.all([
          supabase
            .from("vehicles")
            .select("id", { count: "exact", head: true })
            .eq("company_id", companyId),
          supabase
            .from("leads")
            .select("id", { count: "exact", head: true })
            .eq("company_id", companyId),
        ]);

        const vehicles = Number(vehiclesCount ?? 0);
        const leads = Number(leadsCount ?? 0);

        if (vehicles === 0 || leads === 0) {
          url.pathname = "/app/onboarding";
          url.search = "";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

