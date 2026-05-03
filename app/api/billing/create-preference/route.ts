import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/billing/plans";

// Em produção usa Access Token de produção; em dev usa o token de teste.
// Configure no Vercel:
//   MP_ACCESS_TOKEN      → access token de PRODUÇÃO
//   MP_ACCESS_TOKEN_TEST → access token de TESTE
function getAccessToken(): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return process.env.MP_ACCESS_TOKEN;
  }
  return process.env.MP_ACCESS_TOKEN_TEST ?? process.env.MP_ACCESS_TOKEN;
}

export async function POST(req: NextRequest) {
  const { planId, billingCycle, userEmail, userId } = await req.json();

  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "MP_ACCESS_TOKEN não configurado." },
      { status: 500 }
    );
  }

  // unit_price deve ser numérico — os planos já são numbers, garantia explícita
  const price = Number(billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly);

  // payer.email é obrigatório para o MP criar a preference corretamente
  const payerEmail = typeof userEmail === "string" && userEmail.trim()
    ? userEmail.trim()
    : "cliente@motorgestor.com.br";

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
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
        payer: { email: payerEmail },
        back_urls: {
          success: "https://www.motorgestor.com.br/app/dashboard?payment=success",
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
        notification_url: "https://www.motorgestor.com.br/api/billing/webhook",
      },
    });

    return NextResponse.json({ preferenceId: result.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[create-preference] Erro MP:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
