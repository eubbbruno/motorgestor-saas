import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const PatchSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(["pending", "done", "cancelled"]).optional(),
  due_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
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

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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
  const parsed = PatchSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("lead_tasks")
    .update({
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      ...(parsed.data.due_date !== undefined ? { due_date: parsed.data.due_date } : {}),
    })
    .eq("id", id)
    .select("id, lead_id, company_id, title, description, status, due_date, created_by, created_at")
    .single();

  if (error || !data) {
    console.error("[lead-tasks] patch failed", { userId: user.id, taskId: id, message: error?.message });
    return NextResponse.json({ ok: false, error: "Não foi possível atualizar a tarefa." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, task: data });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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

  const { error } = await supabase.from("lead_tasks").delete().eq("id", id);
  if (error) {
    console.error("[lead-tasks] delete failed", { userId: user.id, taskId: id, message: error.message });
    return NextResponse.json({ ok: false, error: "Não foi possível excluir a tarefa." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

