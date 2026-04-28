import type { VehicleRow } from "@/types/models";
import { xmlEscape, photoUrl } from "./shared";

export function generateWebmotorsXml(
  vehicles: VehicleRow[],
  supabaseUrl: string,
  company: { phone?: string; city?: string; state?: string } = {},
): string {
  const vehiclesXml = vehicles
    .map((v) => {
      const photos = (v.photo_paths ?? [])
        .map((p) => `    <Image>${xmlEscape(photoUrl(supabaseUrl, p))}</Image>`)
        .join("\n");

      return `  <Vehicle>
    <UniqueId>${xmlEscape(v.id)}</UniqueId>
    <Brand>${xmlEscape(v.make ?? "")}</Brand>
    <Model>${xmlEscape(v.model ?? "")}</Model>
    <Version>${xmlEscape(v.version ?? "")}</Version>
    <ModelYear>${xmlEscape(v.year ?? "")}</ModelYear>
    <FabricationYear>${xmlEscape(v.year ?? "")}</FabricationYear>
    <Color>${xmlEscape(v.color ?? "")}</Color>
    <Mileage>${xmlEscape(v.mileage ?? 0)}</Mileage>
    <Price>${xmlEscape(v.price ?? 0)}</Price>
    <Doors>4</Doors>
    <Fuel>${xmlEscape(v.fuel ?? "")}</Fuel>
    <Transmission>${xmlEscape(v.transmission ?? "")}</Transmission>
    <Description>${xmlEscape(v.description_ai ?? v.notes ?? "")}</Description>
    <Images>
${photos}
    </Images>
    <Phone>${xmlEscape(company.phone ?? "")}</Phone>
    <City>${xmlEscape(company.city ?? "")}</City>
    <State>${xmlEscape(company.state ?? "")}</State>
  </Vehicle>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Vehicles>
${vehiclesXml}
</Vehicles>`;
}
