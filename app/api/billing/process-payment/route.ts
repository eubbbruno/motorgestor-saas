import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });
  const payment = new Payment(client);
  const result = await payment.create({ body });

  if (result.status === "approved") {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return NextResponse.json({ status: result.status, id: result.id });
    const isAnnual = result.metadata?.billingCycle === "annual";
    const daysToAdd = isAnnual ? 365 : 30;

    await supabase.from("subscriptions").upsert({
      company_id: result.metadata?.userId,
      plan_id: result.metadata?.planId,
      billing_cycle: result.metadata?.billingCycle,
      status: "active",
      mp_payment_id: result.id?.toString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + daysToAdd * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  return NextResponse.json({ status: result.status, id: result.id });
}
