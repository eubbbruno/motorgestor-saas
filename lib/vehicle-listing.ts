export type VehicleListingInput = {
  title: string;
  make?: string | null;
  model?: string | null;
  version?: string | null;
  year?: number | null;
  mileage?: number | null;
  fuel?: string | null;
  transmission?: string | null;
  color?: string | null;
  price?: number | null;
  fipe_value?: number | null;
  fipe_reference?: string | null;
  notes?: string | null;
  city?: string | null;
  highlights?: string | null;
};

function formatBRL(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function suggestListingTitle(v: VehicleListingInput) {
  const parts: string[] = [];
  const makeModel =
    [v.make, v.model].filter((x) => (x ?? "").trim().length > 0).join(" ") ||
    (v.title ?? "").trim();
  if (makeModel) parts.push(makeModel);

  const version = (v.version ?? "").trim();
  if (version) parts.push(version);

  const year = v.year ? String(v.year) : "";
  if (year) parts.push(year);

  const transmission = (v.transmission ?? "").trim();
  if (transmission) parts.push(transmission);

  // Complemento neutro (sem inventar)
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function buildListingDescription(v: VehicleListingInput) {
  const lines: string[] = [];
  const headline = (suggestListingTitle(v) || v.title || "").trim();
  if (headline) lines.push(headline);

  const bullets: string[] = [];
  if (v.year) bullets.push(`Ano: ${v.year}`);
  if (v.mileage != null) bullets.push(`KM: ${Number(v.mileage).toLocaleString("pt-BR")}`);
  if ((v.fuel ?? "").trim()) bullets.push(`Combustível: ${(v.fuel ?? "").trim()}`);
  if ((v.transmission ?? "").trim()) bullets.push(`Câmbio: ${(v.transmission ?? "").trim()}`);
  if ((v.color ?? "").trim()) bullets.push(`Cor: ${(v.color ?? "").trim()}`);

  const price = v.price != null ? formatBRL(Number(v.price)) : null;
  const fipe = v.fipe_value != null ? formatBRL(Number(v.fipe_value)) : null;

  if (price) bullets.push(`Preço: ${price}`);
  if (fipe) {
    bullets.push(`FIPE${v.fipe_reference ? ` (${v.fipe_reference})` : ""}: ${fipe}`);
  }

  const city = (v.city ?? "").trim();
  if (city) bullets.push(`Cidade: ${city}`);

  if (bullets.length) {
    lines.push("");
    lines.push("Detalhes:");
    lines.push(`- ${bullets.join("\n- ")}`);
  }

  const highlights = (v.highlights ?? "").trim();
  if (highlights) {
    const h = highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12);
    if (h.length) {
      lines.push("");
      lines.push("Diferenciais:");
      lines.push(`- ${h.join("\n- ")}`);
    }
  }

  const notes = (v.notes ?? "").trim();
  if (notes) {
    lines.push("");
    lines.push("Observações:");
    lines.push(notes);
  } else {
    lines.push("");
    lines.push("Chame no WhatsApp para agendar uma visita/test-drive.");
  }

  return lines.join("\n").trim();
}

