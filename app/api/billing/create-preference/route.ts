import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  const { planId, billingCycle, userEmail, userId } = await req.json();

  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const price =
    billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: planId,
          title: `MotorGestor ${plan.name} — ${billingCycle === "annual" ? "Anual" : "Mensal"}`,
          quantity: 1,
          unit_price: price,
          currency_id: "BRL",
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success:
          "https://www.motorgestor.com.br/app/dashboard?payment=success",
        failure: "https://www.motorgestor.com.br/app/billing?payment=error",
        pending: "https://www.motorgestor.com.br/app/billing?payment=pending",
      },
      auto_return: "approved",
      metadata: {
        userId,
        planId,
        billingCycle,
        free_trial: { frequency: 14, frequency_type: "days" },
      },
      notification_url:
        "https://www.motorgestor.com.br/api/billing/webhook",
    },
  });

  return NextResponse.json({ preferenceId: result.id });
}
