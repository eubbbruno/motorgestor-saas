import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSupabase(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = getSupabase(req);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase não configurado." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("lead_events")
    .select("id, lead_id, company_id, type, message, created_by, created_at")
    .eq("lead_id", id)
    .eq("type", "whatsapp")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[lead-whatsapp-history] list failed", { userId: user.id, leadId: id, message: error.message });
    return NextResponse.json(
      { ok: false, error: "Não foi possível carregar o histórico do WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, events: data ?? [] });
}

