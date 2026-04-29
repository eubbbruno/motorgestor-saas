import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  plate: z.string().optional(),
  chassis: z.string().optional(),
  renavam: z.string().optional(),
});

function normalizePlate(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

// ── APIPlacas response shape (campos relevantes) ──────────────────────────────
type ApiPlacasResponse = {
  MARCA?: string;
  MODELO?: string;
  SUBMODELO?: string;
  anoModelo?: string | number;
  anoFabricacao?: string | number;
  cor?: string;
  combustivel?: string;
  carroceria?: string;
  municipio?: string;
  uf?: string;
  placa?: string;
  // fallback genérico
  [key: string]: unknown;
};

async function lookupByApiPlacas(plate: string): Promise<{
  ok: true;
  make: string | null;
  model: string | null;
  version: string | null;
  year: number | null;
  color: string | null;
  fuel: string | null;
  city: string | null;
  state: string | null;
}> {
  const apiKey = process.env.VEHICLE_LOOKUP_API_KEY ?? "";
  if (!apiKey) throw new Error("VEHICLE_LOOKUP_API_KEY não configurada.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let res: Response;
  try {
    res = await fetch(`https://apiplacas.com.br/api/v1/placa/${encodeURIComponent(plate)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`APIPlacas HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as ApiPlacasResponse;

  const yearRaw = data.anoModelo ?? data.anoFabricacao ?? null;
  const year = yearRaw != null ? Number(String(yearRaw).slice(0, 4)) : null;

  return {
    ok: true,
    make: String(data.MARCA ?? "").trim() || null,
    model: String(data.MODELO ?? "").trim() || null,
    version: String(data.SUBMODELO ?? "").trim() || null,
    year: Number.isFinite(year) ? year : null,
    color: String(data.cor ?? "").trim() || null,
    fuel: String(data.combustivel ?? "").trim() || null,
    city: String(data.municipio ?? "").trim() || null,
    state: String(data.uf ?? "").trim() || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  }

  const plate = normalizePlate(parsed.data.plate ?? "");
  const chassis = (parsed.data.chassis ?? "").trim();
  const renavam = (parsed.data.renavam ?? "").trim();

  if (!plate && !chassis && !renavam) {
    return NextResponse.json(
      { ok: false, error: "Informe placa, chassi ou renavam." },
      { status: 400 },
    );
  }

  const provider = (process.env.VEHICLE_LOOKUP_PROVIDER ?? "mock").toLowerCase();

  // ── Mock (desenvolvimento / sem provedor configurado) ─────────────────────
  if (provider === "mock") {
    const hint = plate || chassis.slice(0, 6) || renavam.slice(0, 6);
    const isToyota = hint.endsWith("A") || hint.endsWith("1");
    return NextResponse.json({
      ok: true,
      make: isToyota ? "Toyota" : "Volkswagen",
      model: isToyota ? "Corolla" : "Gol",
      year: 2020,
      version: isToyota ? "XEi 2.0 AT" : "1.6",
      fuel: "Flex",
      color: null,
    });
  }

  // ── APIPlacas ─────────────────────────────────────────────────────────────
  if (provider === "apiplacas") {
    if (!plate) {
      return NextResponse.json(
        { ok: false, error: "A APIPlacas suporta apenas busca por placa." },
        { status: 400 },
      );
    }
    try {
      const result = await lookupByApiPlacas(plate);
      return NextResponse.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "APIPlacas indisponível.";
      console.error("[vehicle-lookup/apiplacas]", message);
      return NextResponse.json(
        { ok: false, error: `Não foi possível consultar a placa: ${message}` },
        { status: 502 },
      );
    }
  }

  // ── Provedor não reconhecido ──────────────────────────────────────────────
  return NextResponse.json(
    {
      ok: false,
      error: `Provedor "${provider}" não reconhecido. Use "mock" ou "apiplacas".`,
    },
    { status: 501 },
  );
}
