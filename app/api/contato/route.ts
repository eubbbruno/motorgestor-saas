import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10),
  pagePath: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase não configurado." },
      { status: 500 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company ?? null,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message,
    page_path: parsed.data.pagePath ?? null,
    utm_source: parsed.data.utm_source ?? null,
    utm_medium: parsed.data.utm_medium ?? null,
    utm_campaign: parsed.data.utm_campaign ?? null,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Não foi possível enviar sua mensagem." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

