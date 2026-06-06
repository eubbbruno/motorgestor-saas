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
  const { error, supabase, companyId } = await getCompanyId();
  if (error || !supabase || !companyId) {
    return NextResponse.json({ error }, { status: error === "Não autenticado." ? 401 : 400 });
  }

  const instanceName = `company_${companyId}`;

  await createInstance(instanceName).catch(() => {});

  await supabase
    .from("companies")
    .update({ whatsapp_instance_name: instanceName })
    .eq("id", companyId);

  const qrData = await getQRCode(instanceName).catch(() => null);
  const qr: string | null = qrData?.qrcode?.base64 ?? qrData?.base64 ?? null;

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
    statusData?.instance?.state ?? statusData?.state ?? statusData?.instanceInfo?.state;
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
