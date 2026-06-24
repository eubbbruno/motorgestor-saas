import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { PLANS, type PlanId } from "@/lib/billing/plans";

function getAccessToken(): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return process.env.MP_ACCESS_TOKEN;
  }
  return process.env.MP_ACCESS_TOKEN_TEST ?? process.env.MP_ACCESS_TOKEN;
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "MP_ACCESS_TOKEN não configurado." }, { status: 500 });
  }

  const body = await req.json();
  // O CheckoutBrick agora envia { formData, planId, billingCycle }.
  // Mantém compatibilidade com chamadas antigas que mandavam o formData cru.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payData: any = body?.formData ?? body;
  const planId = body?.planId as PlanId | undefined;
  const billingCycle = (body?.billingCycle as "monthly" | "annual" | undefined) ?? "monthly";

  // company_id autoritativo vem da SESSÃO — nunca confiar no cliente.
  const supabase = await createSupabaseServerClient();
  let companyId: string | undefined;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();
      companyId = (profile?.company_id as string | null) ?? undefined;
    }
  }

  const client = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);

  // metadata é injetada AQUI — o formData do Brick não carrega a metadata da
  // Preference, então sem isso o webhook não saberia a empresa/plano.
  const result = await payment.create({
    body: {
      ...payData,
      metadata: { userId: companyId, planId, billingCycle },
    },
  });

  if (result.status === "approved" && companyId && planId) {
    // Service client p/ ignorar RLS na escrita (a policy de insert exige is_admin).
    const db = createSupabaseServiceClient() ?? supabase;
    const planName = PLANS[planId]?.name;

    // Mapeia o planId (string) → plans.id (uuid). A coluna plan_id é uuid FK.
    let planUuid: string | undefined;
    if (db && planName) {
      const { data: planRow } = await db
        .from("plans")
        .select("id")
        .eq("name", planName)
        .single();
      planUuid = (planRow?.id as string | null) ?? undefined;
    }

    if (db && planUuid) {
      const daysToAdd = billingCycle === "annual" ? 365 : 30;
      const { error: upsertErr } = await db.from("subscriptions").upsert(
        {
          company_id: companyId,
          plan_id: planUuid,
          billing_cycle: billingCycle,
          status: "active",
          mp_payment_id: result.id?.toString(),
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + daysToAdd * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "company_id" }
      );
      if (upsertErr) {
        console.error("[process-payment] subscription upsert falhou:", upsertErr.message);
      }
    } else {
      console.error(
        "[process-payment] não ativou assinatura — companyId:",
        companyId,
        "planUuid:",
        planUuid ?? "(não encontrado p/ plano " + planName + ")"
      );
    }
  }

  return NextResponse.json({ status: result.status, id: result.id });
}
