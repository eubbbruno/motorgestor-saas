import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Password reset flows pass next=/app/... explicitly; plain confirmation goes to login
        if (next === "/app") {
          return NextResponse.redirect(`${origin}/login?confirmed=true`);
        }
        return NextResponse.redirect(`${origin}${next}`);
      }

      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("expired") || msg.includes("invalid") || msg.includes("otp")) {
        return NextResponse.redirect(`${origin}/login?error=link_expired`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
