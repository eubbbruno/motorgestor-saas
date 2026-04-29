import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { VehicleRow } from "@/types/models";

function esc(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatBRL(n: number | null | undefined) {
  if (n == null) return "—";
  return `R$ ${Number(n).toLocaleString("pt-BR")}`;
}

function photoSrc(supabaseUrl: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/vehicle-photos/${path}`;
}

function buildHtml(vehicles: VehicleRow[], supabaseUrl: string): string {
  const vehicleCards = vehicles
    .map((v) => {
      const photo = v.photo_paths?.[0] ? photoSrc(supabaseUrl, v.photo_paths[0]) : null;
      const specs = [
        v.year ? `Ano: ${v.year}` : null,
        v.mileage != null ? `${Number(v.mileage).toLocaleString("pt-BR")} km` : null,
        v.fuel ?? null,
        v.transmission ?? null,
        v.color ?? null,
      ]
        .filter(Boolean)
        .join(" · ");

      return `
    <div class="vehicle-card">
      ${photo ? `<img src="${esc(photo)}" alt="${esc(v.title)}" class="vehicle-photo" onerror="this.style.display='none'"/>` : `<div class="vehicle-photo-placeholder">Sem foto</div>`}
      <div class="vehicle-info">
        <div class="vehicle-title">${esc(v.title)}</div>
        ${specs ? `<div class="vehicle-specs">${esc(specs)}</div>` : ""}
        ${v.description_ai ?? v.notes ? `<div class="vehicle-desc">${esc((v.description_ai ?? v.notes ?? "").slice(0, 220))}${(v.description_ai ?? v.notes ?? "").length > 220 ? "…" : ""}</div>` : ""}
        <div class="vehicle-price">${formatBRL(v.price)}</div>
      </div>
    </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Catálogo de Veículos — MotorGestor</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 12px; color: #111; background: white; padding: 2rem; }
  .catalog-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #16a34a; padding-bottom: 12px; margin-bottom: 24px; }
  .logo { font-size: 22px; font-weight: 900; color: #16a34a; letter-spacing: -0.03em; }
  .catalog-meta { font-size: 11px; color: #666; text-align: right; }
  .catalog-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .vehicle-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .vehicle-card { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; }
  .vehicle-photo { width: 100%; height: 160px; object-fit: cover; display: block; }
  .vehicle-photo-placeholder { width: 100%; height: 100px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #9ca3af; }
  .vehicle-info { padding: 12px; }
  .vehicle-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .vehicle-specs { font-size: 10px; color: #6b7280; margin-bottom: 6px; }
  .vehicle-desc { font-size: 10px; color: #4b5563; line-height: 1.5; margin-bottom: 8px; }
  .vehicle-price { font-size: 16px; font-weight: 800; color: #16a34a; }
  .catalog-footer { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #9ca3af; }
  .no-print-btn { position: fixed; top: 16px; right: 16px; background: #16a34a; color: white; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; z-index: 999; }
  @media print {
    .no-print-btn { display: none; }
    body { padding: 1cm; }
    .vehicle-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>
</head>
<body>
<button class="no-print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
<div class="catalog-header">
  <div>
    <div class="logo">MotorGestor</div>
    <div class="catalog-title">Catálogo de Veículos</div>
  </div>
  <div class="catalog-meta">
    <div>${vehicles.length} veículo${vehicles.length !== 1 ? "s" : ""} disponíve${vehicles.length !== 1 ? "is" : "l"}</div>
    <div>${new Date().toLocaleDateString("pt-BR")}</div>
  </div>
</div>
<div class="vehicle-grid">
${vehicleCards}
</div>
<div class="catalog-footer">
  <span>Gerado pelo MotorGestor</span>
  <span>motorgestor.com.br</span>
  <span>${new Date().toLocaleString("pt-BR")}</span>
</div>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll() {},
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) {
    return new NextResponse("Empresa não encontrada.", { status: 403 });
  }

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("company_id", profile.company_id)
    .in("status", ["disponivel", "reservado"])
    .order("created_at", { ascending: false });

  if (error) return new NextResponse("Erro ao buscar veículos.", { status: 500 });

  const html = buildHtml((vehicles ?? []) as VehicleRow[], process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store" },
  });
}
