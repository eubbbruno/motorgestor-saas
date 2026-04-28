import type { VehicleRow } from "@/types/models";

/** Escapa caracteres especiais do XML. */
export function xmlEscape(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Monta a URL pública de uma foto no bucket vehicle-photos. */
export function photoUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/vehicle-photos/${path}`;
}

/** Retorna apenas veículos disponíveis (não vendidos/inativos). */
export function exportableVehicles(vehicles: VehicleRow[]): VehicleRow[] {
  return vehicles.filter((v) => v.status === "disponivel" || v.status === "reservado");
}
