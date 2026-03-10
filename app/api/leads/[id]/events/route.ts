import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const CreateSchema = z.object({
  type: z.enum(["created", "note", "status_change", "call", "visit", "sale"]),
  message: z.string().trim().min(1, "Informe uma mensagem.").max(2000).optional().nullable(),
});

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

  // Busca eventos por lead_id; RLS garante company_id
  const { data, error } = await supabase
    .from("lead_events")
    .select("id, lead_id, company_id, type, message, created_by, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[lead-events] list failed", { userId: user.id, leadId: id, message: error.message });
    return NextResponse.json({ ok: false, error: "Não foi possível carregar a timeline." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, events: data ?? [] });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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

  const input = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  // Descobre company_id do lead para gravar corretamente
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("company_id")
    .eq("id", id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ ok: false, error: "Lead não encontrado." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("lead_events")
    .insert({
      lead_id: id,
      company_id: lead.company_id,
      type: parsed.data.type,
      message: parsed.data.message ?? null,
      created_by: user.id,
    })
    .select("id, lead_id, company_id, type, message, created_by, created_at")
    .single();

  if (error || !data) {
    console.error("[lead-events] create failed", {
      userId: user.id,
      leadId: id,
      message: error?.message,
    });
    return NextResponse.json({ ok: false, error: "Não foi possível salvar o evento." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, event: data });
}

