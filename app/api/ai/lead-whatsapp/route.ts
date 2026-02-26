import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  leadName: z.string().min(2),
  vehicleTitle: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

function mockWhatsapp(input: z.infer<typeof Schema>) {
  const firstName = input.leadName.trim().split(/\s+/)[0] ?? "tudo bem";
  const vehicle = input.vehicleTitle ? ` sobre o ${input.vehicleTitle}` : "";
  const origin = input.source ? ` Vi que você veio por ${input.source}.` : "";

  const short = [
    `Olá, ${firstName}! Tudo bem?`,
    `Aqui é da MotorGestor.${origin}`,
    `Posso te ajudar${vehicle}?`,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const long = [
    `Olá, ${firstName}! Tudo bem?`,
    `Aqui é da MotorGestor.${origin}`,
    vehicle ? `Você tinha interesse no ${input.vehicleTitle}.` : "Quero entender melhor o que você procura.",
    "Me diz rapidinho:",
    "- você já tem um carro para dar como troca?",
    "- qual forma de pagamento prefere (à vista/financiamento)?",
    "- melhor horário para falarmos hoje?",
    "Se preferir, posso agendar um test-drive e te enviar mais fotos/vídeos.",
  ]
    .join("\n")
    .trim();

  return { short, long };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function openaiWhatsapp(input: z.infer<typeof Schema>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada.");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const prompt = [
    "Você é um vendedor de veículos no Brasil escrevendo mensagens para WhatsApp.",
    "Gere 2 versões em PT-BR:",
    "1) curta (1-2 linhas)",
    "2) longa (até ~8 linhas, com perguntas objetivas em bullets)",
    "Regras:",
    "- Sem emojis",
    "- Tom educado e profissional",
    "- Não invente fatos",
    "",
    `Contexto: ${JSON.stringify(input)}`,
    "",
    "Responda em JSON estrito com as chaves: short, long",
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
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Você retorna JSON válido e apenas JSON." },
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

  const parsed = z
    .object({ short: z.string().min(1), long: z.string().min(1) })
    .safeParse(JSON.parse(content));
  if (!parsed.success) throw new Error("Resposta inválida do modelo.");
  return parsed.data;
}

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos para gerar mensagem." },
      { status: 400 },
    );
  }

  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  try {
    const data = provider === "openai" ? await openaiWhatsapp(parsed.data) : mockWhatsapp(parsed.data);
    return NextResponse.json({ ok: true, ...data, provider });
  } catch (err: unknown) {
    console.error("[ai] lead-whatsapp failed", {
      provider,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "IA indisponível no momento. Tente novamente." },
      { status: 502 },
    );
  }
}

