import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendPaymentConfirmedEmail, sendPaymentFailedEmail } from "@/lib/email/send";
import { PLANS } from "@/lib/billing/plans";

function getAccessToken(): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return process.env.MP_ACCESS_TOKEN;
  }
  return process.env.MP_ACCESS_TOKEN_TEST ?? process.env.MP_ACCESS_TOKEN;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const accessToken = getAccessToken();
  if (!accessToken) return NextResponse.json({ ok: true });

  const client = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);
  const result = await payment.get({ id: body.data.id });

  const db = createSupabaseServiceClient();
  if (!db) return NextResponse.json({ ok: true });

  const isApproved = result.status === "approved";
  const companyId = result.metadata?.userId as string | undefined;
  const planId = result.metadata?.planId as keyof typeof PLANS | undefined;
  const billingCycle = (result.metadata?.billingCycle as "monthly" | "annual" | undefined) ?? "monthly";

  // Atualiza a assinatura. Só faz upsert completo se tivermos company_id +
  // plano (a coluna company_id/plan_id é NOT NULL). Sem isso, ignora — o
  // process-payment já criou a linha de forma síncrona p/ cartões aprovados.
  if (companyId && planId) {
    const planName = PLANS[planId]?.name;
    const { data: planRow } = await db
      .from("plans")
      .select("id")
      .eq("name", planName)
      .single();
    const planUuid = (planRow?.id as string | null) ?? undefined;

    if (planUuid) {
      const daysToAdd = billingCycle === "annual" ? 365 : 30;
      await db.from("subscriptions").upsert(
        {
          company_id: companyId,
          plan_id: planUuid,
          billing_cycle: billingCycle,
          status: isApproved ? "active" : "inactive",
          mp_payment_id: result.id?.toString(),
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + daysToAdd * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "company_id" }
      );
    }
  }

  // Get user info for email — requires companyId from payment metadata
  if (companyId) {
    const { data: profile } = await db
      .from("profiles")
      .select("email, full_name")
      .eq("company_id", companyId)
      .limit(1)
      .single();

    const email = profile?.email;
    const name = profile?.full_name || "Cliente";

    if (email) {
      if (isApproved) {
        const plan = planId ? PLANS[planId] : null;
        const amount = plan
          ? (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly)
          : (result.transaction_amount ?? 0);
        const daysToAdd = billingCycle === "annual" ? 365 : 30;
        const nextBilling = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

        sendPaymentConfirmedEmail(email, name, plan?.name ?? planId ?? "Pro", amount, nextBilling)
          .catch(err => console.error("[billing/webhook] sendPaymentConfirmedEmail failed:", err));
      } else {
        sendPaymentFailedEmail(email, name)
          .catch(err => console.error("[billing/webhook] sendPaymentFailedEmail failed:", err));
      }
    }
  }

  return NextResponse.json({ ok: true });
}
