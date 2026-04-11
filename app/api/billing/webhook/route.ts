import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });
  const payment = new Payment(client);
  const result = await payment.get({ id: body.data.id });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: true });

  await supabase.from("subscriptions").upsert(
    {
      mp_payment_id: result.id?.toString(),
      status: result.status === "approved" ? "active" : "inactive",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "mp_payment_id" }
  );

  return NextResponse.json({ ok: true });
}
