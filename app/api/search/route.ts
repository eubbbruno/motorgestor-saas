import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const QuerySchema = z.object({
  q: z.string().trim().min(2).max(80),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({ q: url.searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ ok: true, q: "", leads: [], vehicles: [] });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase não configurado." },
      { status: 500 },
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const q = parsed.data.q.replace(/[,()]/g, " ").trim();
  const like = `%${q}%`;

  // RLS já restringe por company_id (tenant).
  const [{ data: leads, error: leadsError }, { data: vehicles, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id, name, phone, email, status")
        .or(`name.ilike.${like},phone.ilike.${like}`)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("vehicles")
        .select("id, title, make, model, plate, status")
        .or(`title.ilike.${like},make.ilike.${like},model.ilike.${like},plate.ilike.${like}`)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  if (leadsError || vehiclesError) {
    console.error("[search] failed", {
      userId: user.id,
      leads: leadsError?.message,
      vehicles: vehiclesError?.message,
    });
    return NextResponse.json(
      { ok: false, error: "Não foi possível buscar agora." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    q,
    leads: leads ?? [],
    vehicles: vehicles ?? [],
  });
}

