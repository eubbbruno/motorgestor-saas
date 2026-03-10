import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

type Marca = { nome: string; codigo: string };
type Modelo = { nome: string; codigo: number | string };
type ModelosResponse = { modelos: Modelo[] };
type Ano = { nome: string; codigo: string };

type CacheEntry = { expiresAt: number; data: unknown };
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

async function fetchJson<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "motorgestor/1.0 (+fipe-options)" },
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) throw new Error(`FIPE upstream HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

const QuerySchema = z.object({
  brandCode: z.string().min(1).optional(),
  modelCode: z.string().min(1).optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    brandCode: url.searchParams.get("brandCode") ?? undefined,
    modelCode: url.searchParams.get("modelCode") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Parâmetros inválidos." }, { status: 400 });
  }

  const { brandCode, modelCode } = parsed.data;
  const base = process.env.FIPE_API_BASE_URL ?? "https://parallelum.com.br/fipe/api/v1/carros";

  const key = brandCode ? (modelCode ? `years|${brandCode}|${modelCode}` : `models|${brandCode}`) : "brands";
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ ok: true, key, data: cached.data });
  }

  try {
    if (!brandCode) {
      const marcas = await fetchJson<Marca[]>(`${base}/marcas`, 7000);
      const data = (marcas ?? []).map((m) => ({ code: m.codigo, name: m.nome }));
      cache.set(key, { expiresAt: now + CACHE_TTL_MS, data });
      return NextResponse.json({ ok: true, key, data });
    }

    if (brandCode && !modelCode) {
      const modelosResp = await fetchJson<ModelosResponse>(`${base}/marcas/${brandCode}/modelos`, 7000);
      const data = (modelosResp.modelos ?? []).map((m) => ({ code: String(m.codigo), name: m.nome }));
      cache.set(key, { expiresAt: now + CACHE_TTL_MS, data });
      return NextResponse.json({ ok: true, key, data });
    }

    const anos = await fetchJson<Ano[]>(
      `${base}/marcas/${brandCode}/modelos/${modelCode}/anos`,
      8000,
    );
    const data = (anos ?? []).map((a) => ({
      code: a.codigo,
      name: a.nome,
      year: Number(String(a.nome).slice(0, 4)),
    }));
    cache.set(key, { expiresAt: now + CACHE_TTL_MS, data });
    return NextResponse.json({ ok: true, key, data });
  } catch (err: unknown) {
    console.error("[fipe-options] failed", {
      brandCode,
      modelCode,
      base: process.env.FIPE_API_BASE_URL ?? "(default)",
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "Não foi possível carregar opções da FIPE agora." },
      { status: 502 },
    );
  }
}

