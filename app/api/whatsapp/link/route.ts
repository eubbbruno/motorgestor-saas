import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInstanceStatus } from "@/lib/whatsapp/evolution-go";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const instanceName: string = (body.instanceName ?? "").trim();
  const phoneNumber: string = (body.phoneNumber ?? "").replace(/\D/g, "");

  if (!instanceName) {
    return NextResponse.json({ error: "Nome da instância é obrigatório." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase ausente." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const companyId = profile?.company_id;
  if (!companyId) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 400 });
  }

  // Verify instance exists and is connected on Evolution GO
  console.log("[link/POST] checking instance:", instanceName);
  let statusData: Record<string, unknown>;
  try {
    statusData = await getInstanceStatus(instanceName);
    console.log("[link/POST] status response:", JSON.stringify(statusData));
  } catch (err) {
    console.error("[link/POST] getInstanceStatus threw:", err);
    return NextResponse.json(
      { error: "Não foi possível contactar o Evolution GO. Verifique o nome da instância." },
      { status: 502 },
    );
  }

  const state: string | undefined =
    (statusData?.instance as { state?: string } | undefined)?.state ??
    (statusData?.state as string | undefined) ??
    (statusData?.instanceInfo as { state?: string } | undefined)?.state;

  console.log("[link/POST] instance state:", state);

  if (state !== "open") {
    return NextResponse.json(
      {
        error: `Instância "${instanceName}" não está conectada (estado: ${state ?? "desconhecido"}). Abra o Evolution GO Manager e verifique se a instância está ativa.`,
      },
      { status: 400 },
    );
  }

  // Save instance name and phone number to company
  const { error: dbError } = await supabase
    .from("companies")
    .update({
      whatsapp_instance_name: instanceName,
      whatsapp_phone_number_id: phoneNumber || null,
    })
    .eq("id", companyId);

  if (dbError) {
    console.error("[link/POST] DB error:", dbError);
    return NextResponse.json({ error: "Erro ao salvar no banco de dados." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, instanceName, phoneNumber: phoneNumber || null });
}
