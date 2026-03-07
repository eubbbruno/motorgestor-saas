import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function safeNext(next: string | null) {
  if (!next) return "/app";
  if (!next.startsWith("/")) return "/app";
  return next;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem env, não quebra o deploy: apenas redireciona.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const pendingCookies: Array<{
    name: string;
    value: string;
    options: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const redirect = (to: string) => {
    const res = NextResponse.redirect(new URL(to, url.origin));
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

  if (code) {
    // Troca o authorization code por sessão e grava cookies httpOnly
    await supabase.auth.exchangeCodeForSession(code);
  }

  return redirect(next);
}

