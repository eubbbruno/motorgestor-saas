import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createInstance,
  deleteInstance,
  getInstanceStatus,
  getQRCode,
} from "@/lib/whatsapp/evolution-go";

async function getCompanyId() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase ausente.", supabase: null, companyId: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado.", supabase: null, companyId: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id)
    return { error: "Empresa não encontrada.", supabase: null, companyId: null };

  return { error: null, supabase, companyId: profile.company_id as string };
}

// POST — cria instância e retorna QR code
export async function POST() {
  console.log("[setup/POST] chamado");

  // Verifica variáveis de ambiente
  const evoUrl = process.env.EVOLUTION_GO_URL;
  const evoKey = process.env.EVOLUTION_GO_API_KEY;
  console.log("[setup/POST] EVOLUTION_GO_URL:", evoUrl ?? "AUSENTE");
  console.log("[setup/POST] EVOLUTION_GO_API_KEY:", evoKey ? `${evoKey.slice(0, 6)}...` : "AUSENTE");

  const { error, supabase, companyId } = await getCompanyId();
  if (error || !supabase || !companyId) {
    console.error("[setup/POST] auth/company error:", error);
    return NextResponse.json({ error }, { status: error === "Não autenticado." ? 401 : 400 });
  }

  const instanceName = `company_${companyId}`;
  console.log("[setup/POST] instanceName:", instanceName);

  let createResult: unknown;
  try {
    createResult = await createInstance(instanceName);
    console.log("[setup/POST] createInstance response:", JSON.stringify(createResult));
  } catch (err) {
    console.error("[setup/POST] createInstance threw:", err);
  }

  const { error: dbError } = await supabase
    .from("companies")
    .update({ whatsapp_instance_name: instanceName })
    .eq("id", companyId);
  if (dbError) console.error("[setup/POST] DB update error:", dbError);
  else console.log("[setup/POST] instanceName salvo no DB");

  let qrData: unknown;
  let qr: string | null = null;
  try {
    qrData = await getQRCode(instanceName);
    console.log("[setup/POST] getQRCode response:", JSON.stringify(qrData));
    qr =
      (qrData as Record<string, unknown> & { qrcode?: { base64?: string }; base64?: string })
        ?.qrcode?.base64 ??
      (qrData as { base64?: string })?.base64 ??
      null;
    console.log("[setup/POST] QR extraído:", qr ? `base64[${(qr as string).length} chars]` : "null");
  } catch (err) {
    console.error("[setup/POST] getQRCode threw:", err);
  }

  return NextResponse.json({ ok: true, instance_name: instanceName, qr });
}

// GET — retorna status da instância + QR code se não conectado
export async function GET() {
  const { error, supabase, companyId } = await getCompanyId();
  if (error || !supabase || !companyId) {
    return NextResponse.json({ error }, { status: error === "Não autenticado." ? 401 : 400 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_instance_name")
    .eq("id", companyId)
    .single();

  const instanceName = company?.whatsapp_instance_name as string | null;
  if (!instanceName) return NextResponse.json({ ok: true, connected: false, qr: null });

  const statusData = await getInstanceStatus(instanceName).catch(() => null);
  const state: string | undefined =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (statusData as any)?.instance?.state ?? (statusData as any)?.state;
  const connected = state === "open";

  let qr: string | null = null;
  if (!connected) {
    const qrData = await getQRCode(instanceName).catch(() => null);
    qr = qrData?.qrcode?.base64 ?? qrData?.base64 ?? null;
  }

  return NextResponse.json({ ok: true, connected, instance_name: instanceName, qr });
}

// DELETE — desconecta e remove instância
export async function DELETE(_req: NextRequest) {
  const { error, supabase, companyId } = await getCompanyId();
  if (error || !supabase || !companyId) {
    return NextResponse.json({ error }, { status: error === "Não autenticado." ? 401 : 400 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_instance_name")
    .eq("id", companyId)
    .single();

  const instanceName = company?.whatsapp_instance_name as string | null;
  if (instanceName) {
    await deleteInstance(instanceName).catch(() => {});
  }

  await supabase
    .from("companies")
    .update({ whatsapp_instance_name: null })
    .eq("id", companyId);

  return NextResponse.json({ ok: true });
}
