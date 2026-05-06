import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendTrialExpiringEmail } from "@/lib/email/send";

// Protegido por Authorization: Bearer CRON_SECRET
// Configurar no Vercel como cron job: GET /api/cron/trial-expiring a cada dia
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const db = createSupabaseServiceClient();
  if (!db) return NextResponse.json({ ok: false, error: "Supabase ausente." }, { status: 500 });

  // Busca trials que expiram entre hoje e 3 dias
  const now = new Date();
  const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const { data: trials, error } = await db
    .from("subscriptions")
    .select("company_id, current_period_end")
    .eq("status", "trial")
    .gte("current_period_end", now.toISOString())
    .lte("current_period_end", in3days.toISOString());

  if (error) {
    console.error("[cron/trial-expiring] query failed:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!trials || trials.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const trial of trials) {
    const { data: profile } = await db
      .from("profiles")
      .select("email, full_name")
      .eq("company_id", trial.company_id)
      .limit(1)
      .single();

    if (!profile?.email) continue;

    const name = profile.full_name || "Cliente";

    try {
      await sendTrialExpiringEmail(profile.email, name, trial.current_period_end);
      sent++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[cron/trial-expiring] email failed for ${profile.email}:`, err);
      errors.push(msg);
    }
  }

  return NextResponse.json({ ok: true, sent, errors: errors.length ? errors : undefined });
}
