import { NextRequest, NextResponse } from "next/server";
import { resolveExportAuth, fetchVehiclesForExport } from "../_auth";
import { generateWebmotorsXml } from "@/lib/exports/webmotors";

export async function GET(req: NextRequest) {
  const auth = await resolveExportAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { companyId, supabase } = auth;

  let vehicles;
  try {
    vehicles = await fetchVehiclesForExport(supabase, companyId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar veículos.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const xml = generateWebmotorsXml(vehicles, supabaseUrl);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}
