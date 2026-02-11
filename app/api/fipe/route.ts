import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
});

type CacheEntry = {
  expiresAt: number;
  value: number;
  reference: string;
  fipeCode?: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ");
}

function pickBestByName<T extends { nome: string }>(items: T[], query: string): T | null {
  const q = normalizeName(query);
  if (!q) return null;

  // 1) exact match
  const exact = items.find((i) => normalizeName(i.nome) === q);
  if (exact) return exact;

  // 2) startsWith
  const starts = items.find((i) => normalizeName(i.nome).startsWith(q));
  if (starts) return starts;

  // 3) includes
  const inc = items.find((i) => normalizeName(i.nome).includes(q));
  if (inc) return inc;

  return null;
}

function parseBRL(value: string): number | null {
  // "R$ 45.000,00" -> 45000.00
  const cleaned = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

async function fetchJson<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "motorgestor/1.0 (+fipe)" },
      // FIPE é público e muda pouco; cache do Next ajuda em runtime
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) {
      throw new Error(`FIPE upstream HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

type Marca = { nome: string; codigo: string };
type Modelo = { nome: string; codigo: number | string };
type ModelosResponse = { modelos: Modelo[] };
type Ano = { nome: string; codigo: string };
type ValorResponse = { Valor: string; MesReferencia: string; CodigoFipe?: string };

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Informe marca, modelo e ano." },
      { status: 400 },
    );
  }

  const { make, model, year } = parsed.data;
  const key = `${normalizeName(make)}|${normalizeName(model)}|${year}`;

  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ ok: true, ...cached });
  }

  const base = process.env.FIPE_API_BASE_URL ?? "https://parallelum.com.br/fipe/api/v1/carros";

  try {
    const marcas = await fetchJson<Marca[]>(`${base}/marcas`, 6000);
    const marca = pickBestByName(marcas, make);
    if (!marca) {
      return NextResponse.json(
        { ok: false, error: "Marca não encontrada na FIPE." },
        { status: 404 },
      );
    }

    const modelosResp = await fetchJson<ModelosResponse>(
      `${base}/marcas/${marca.codigo}/modelos`,
      7000,
    );
    const modelo = pickBestByName(modelosResp.modelos ?? [], model);
    if (!modelo) {
      return NextResponse.json(
        { ok: false, error: "Modelo não encontrado para essa marca na FIPE." },
        { status: 404 },
      );
    }

    const anos = await fetchJson<Ano[]>(
      `${base}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos`,
      7000,
    );
    const ano = anos.find((a) => normalizeName(a.nome).startsWith(String(year)));
    if (!ano) {
      return NextResponse.json(
        { ok: false, error: "Ano não encontrado para esse modelo na FIPE." },
        { status: 404 },
      );
    }

    const valor = await fetchJson<ValorResponse>(
      `${base}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos/${ano.codigo}`,
      8000,
    );

    const n = parseBRL(valor.Valor);
    if (n == null) {
      return NextResponse.json(
        { ok: false, error: "Não foi possível interpretar o valor da FIPE." },
        { status: 502 },
      );
    }

    const result: CacheEntry = {
      expiresAt: now + CACHE_TTL_MS,
      value: n,
      reference: valor.MesReferencia,
      fipeCode: valor.CodigoFipe,
    };
    cache.set(key, result);

    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    console.error("[fipe] failed", {
      make,
      model,
      year,
      base: process.env.FIPE_API_BASE_URL ?? "(default)",
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "FIPE indisponível no momento. Tente novamente." },
      { status: 502 },
    );
  }
}

