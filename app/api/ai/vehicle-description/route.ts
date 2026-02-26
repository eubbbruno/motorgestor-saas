import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  title: z.string().min(3),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  mileage: z.number().int().min(0).optional().nullable(),
  fuel: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function mockVehicleDescription(input: z.infer<typeof Schema>) {
  const parts: string[] = [];
  const headline = input.title.trim();
  parts.push(`${headline}`);

  const bullets: string[] = [];
  if (input.year) bullets.push(`Ano: ${input.year}`);
  if (input.mileage != null) bullets.push(`KM: ${input.mileage.toLocaleString("pt-BR")}`);
  if (input.fuel) bullets.push(`Combustível: ${input.fuel}`);
  if (input.transmission) bullets.push(`Câmbio: ${input.transmission}`);
  if (input.color) bullets.push(`Cor: ${input.color}`);
  if (input.price != null) bullets.push(`Valor: ${formatBRL(input.price)}`);

  const intro = [
    "Veículo com excelente custo-benefício, ideal para quem busca conforto, segurança e manutenção em dia.",
    "Documentação em ordem e pronto para transferência.",
  ].join(" ");

  const body = bullets.length
    ? `\n\nDestaques:\n- ${bullets.join("\n- ")}`
    : "";

  const closing = input.notes
    ? `\n\nObservações:\n${input.notes.trim()}`
    : "\n\nChame no WhatsApp para agendar uma visita/test-drive.";

  return `${parts.join(" ")}\n\n${intro}${body}${closing}`.trim();
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function openaiVehicleDescription(input: z.infer<typeof Schema>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const prompt = [
    "Você é um redator especialista em anúncios de veículos no Brasil.",
    "Escreva uma descrição profissional, direta e convincente em PT-BR.",
    "Regras:",
    "- Sem emojis",
    "- Sem promessas falsas",
    "- Não invente itens não informados",
    "- Use parágrafos curtos + lista de destaques quando fizer sentido",
    "",
    `Dados do veículo: ${JSON.stringify(input)}`,
  ].join("\n");

  const res = await fetchWithTimeout(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        messages: [
          { role: "system", content: "Você escreve textos objetivos e bem formatados." },
          { role: "user", content: prompt },
        ],
      }),
    },
    12000,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}${text ? `: ${text}` : ""}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Resposta vazia do modelo.");
  return content;
}

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos para gerar descrição." },
      { status: 400 },
    );
  }

  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  try {
    const text =
      provider === "openai"
        ? await openaiVehicleDescription(parsed.data)
        : mockVehicleDescription(parsed.data);

    return NextResponse.json({ ok: true, description: text, provider });
  } catch (err: unknown) {
    console.error("[ai] vehicle-description failed", {
      provider,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "IA indisponível no momento. Tente novamente." },
      { status: 502 },
    );
  }
}

