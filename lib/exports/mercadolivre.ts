import type { VehicleRow } from "@/types/models";
import { xmlEscape, photoUrl } from "./shared";

export function generateMercadoLivreXml(
  vehicles: VehicleRow[],
  supabaseUrl: string,
  company: { city?: string; state?: string } = {},
): string {
  const listingsXml = vehicles
    .map((v) => {
      const title = [v.make, v.model, v.version, v.year].filter(Boolean).join(" ");
      const photos = (v.photo_paths ?? [])
        .map((p) => `      <picture url="${xmlEscape(photoUrl(supabaseUrl, p))}"/>`)
        .join("\n");

      return `  <listing>
    <id>${xmlEscape(v.id)}</id>
    <title>${xmlEscape(title || v.title)}</title>
    <price currency="BRL">${xmlEscape(v.price ?? 0)}</price>
    <category_id>MLB1744</category_id>
    <condition>used</condition>
    <description>${xmlEscape(v.description_ai ?? v.notes ?? "")}</description>
    <attributes>
      <attribute name="BRAND" value="${xmlEscape(v.make ?? "")}"/>
      <attribute name="MODEL" value="${xmlEscape(v.model ?? "")}"/>
      <attribute name="YEAR" value="${xmlEscape(v.year ?? "")}"/>
      <attribute name="KILOMETERS" value="${xmlEscape(v.mileage ?? 0)}"/>
      <attribute name="FUEL_TYPE" value="${xmlEscape(v.fuel ?? "")}"/>
      <attribute name="TRANSMISSION" value="${xmlEscape(v.transmission ?? "")}"/>
      <attribute name="COLOR" value="${xmlEscape(v.color ?? "")}"/>
      <attribute name="DOORS" value="4"/>
      <attribute name="VEHICLE_YEAR" value="${xmlEscape(v.year ?? "")}"/>
    </attributes>
    <pictures>
${photos}
    </pictures>
    <location>
      <city>${xmlEscape(company.city ?? "")}</city>
      <state>${xmlEscape(company.state ?? "")}</state>
    </location>
  </listing>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<listings>
${listingsXml}
</listings>`;
}
