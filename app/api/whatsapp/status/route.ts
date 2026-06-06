import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInstanceStatus } from "@/lib/whatsapp/evolution-go";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, configured: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, configured: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) return NextResponse.json({ ok: true, configured: false });

  const { data: company } = await supabase
    .from("companies")
    .select("whatsapp_instance_name")
    .eq("id", profile.company_id)
    .single();

  const instanceName = company?.whatsapp_instance_name as string | null;
  if (!instanceName) return NextResponse.json({ ok: true, configured: false });

  const statusData = await getInstanceStatus(instanceName).catch(() => null);
  const state: string | undefined =
    statusData?.instance?.state ?? statusData?.state ?? statusData?.instanceInfo?.state;
  const connected = state === "open";

  return NextResponse.json({
    ok: true,
    configured: connected,
    instance_name: instanceName,
  });
}
