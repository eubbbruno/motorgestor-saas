import type { VehicleRow } from "@/types/models";
import { xmlEscape, photoUrl } from "./shared";

export function generateOlxXml(vehicles: VehicleRow[], supabaseUrl: string): string {
  const adsXml = vehicles
    .map((v) => {
      const title = [v.make, v.model, v.year].filter(Boolean).join(" ");
      const photos = (v.photo_paths ?? [])
        .map((p) => `      <image url="${xmlEscape(photoUrl(supabaseUrl, p))}"/>`)
        .join("\n");

      return `  <ad>
    <id>${xmlEscape(v.id)}</id>
    <title>${xmlEscape(title || v.title)}</title>
    <body>${xmlEscape(v.description_ai ?? v.notes ?? "")}</body>
    <price>${xmlEscape(v.price ?? 0)}</price>
    <category>CARS_AND_VANS</category>
    <phone_hidden>0</phone_hidden>
    <params>
      <param name="vehicle_brand" value="${xmlEscape(v.make ?? "")}"/>
      <param name="vehicle_model" value="${xmlEscape(v.model ?? "")}"/>
      <param name="vehicle_year" value="${xmlEscape(v.year ?? "")}"/>
      <param name="vehicle_mileage" value="${xmlEscape(v.mileage ?? 0)}"/>
      <param name="vehicle_fuel" value="${xmlEscape(v.fuel ?? "")}"/>
      <param name="vehicle_gearbox" value="${xmlEscape(v.transmission ?? "")}"/>
      <param name="vehicle_color" value="${xmlEscape(v.color ?? "")}"/>
      <param name="vehicle_doors" value="4"/>
    </params>
    <images>
${photos}
    </images>
  </ad>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ads>
${adsXml}
</ads>`;
}
