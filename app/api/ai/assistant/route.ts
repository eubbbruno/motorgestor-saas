import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const HELP_SYSTEM_PROMPT = `Você é o Assistente MotorGestor, um ajudante especializado no sistema MotorGestor — um SaaS para concessionárias de veículos no Brasil.

Você sabe tudo sobre o MotorGestor:
- Cadastro e gestão de veículos (estoque, FIPE, fotos, exportação PDF)
- CRM de leads com pipeline e funil de vendas
- Agenda de eventos, visitas e test-drives
- Relatórios de desempenho e conversão
- Integrações com WhatsApp Business
- Exportação de catálogos para OLX, Webmotors e Mercado Livre
- Planos e cobrança via Mercado Pago
- Configurações da conta e da empresa

Responda de forma direta, útil e em português brasileiro. Seja conciso — máximo 3 parágrafos. Se não souber algo específico do sistema, oriente o usuário a explorar o menu lateral ou entrar em contato com o suporte.`;

/** Extrai uma string de diagnóstico legível de qualquer erro. */
function describeError(err: unknown): string {
  if (err == null) return "null/undefined";
  if (err instanceof Anthropic.APIError) {
    return `Anthropic APIError — status=${err.status} name=${err.name} message=${err.message}`;
  }
  if (err instanceof Error) {
    return `${err.name}: ${err.message}${err.cause ? ` (cause: ${String(err.cause)})` : ""}`;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userMessage = (body.message ?? body.leadMessage ?? "").trim();

  if (!userMessage) {
    return NextResponse.json({ ok: false, error: "Mensagem vazia." }, { status: 400 });
  }

  // ── Diagnóstico da chave ─────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  const keyDiag = apiKey
    ? `presente (${apiKey.slice(0, 10)}…, ${apiKey.length} chars)`
    : "AUSENTE";
  console.log("[ai/assistant] ANTHROPIC_API_KEY:", keyDiag);

  if (!apiKey) {
    console.error("[ai/assistant] ANTHROPIC_API_KEY não configurada.");
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY não configurada." },
      { status: 500 },
    );
  }

  // Instancia dentro do handler para garantir que a env var está disponível
  const anthropic = new Anthropic({ apiKey });

  // ── Modo legado (lead response com contexto de veículos) ─────────────────
  if (body.vehicleContext || body.companyName) {
    const companyName = body.companyName ?? "MotorGestor";
    const vehicleContext = body.vehicleContext ?? "Nenhum veículo disponível no momento.";
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: `Você é um assistente de vendas da concessionária ${companyName}. Responda de forma simpática, direta e profissional. Foque em entender o interesse do cliente e apresentar veículos disponíveis. Nunca invente informações sobre veículos — use apenas o contexto fornecido.`,
        messages: [{ role: "user", content: `Contexto do estoque: ${vehicleContext}\n\nMensagem do lead: ${userMessage}` }],
      });
      const reply = response.content[0].type === "text" ? response.content[0].text : "";
      return NextResponse.json({ ok: true, reply });
    } catch (err: unknown) {
      const desc = describeError(err);
      console.error("[ai/assistant] modo legado falhou:", desc);
      return NextResponse.json({ ok: false, error: "IA indisponível.", detail: desc }, { status: 502 });
    }
  }

  // ── Modo assistente geral ────────────────────────────────────────────────
  try {
    console.log("[ai/assistant] enviando para Claude, model=claude-sonnet-4-6, chars=", userMessage.length);
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: HELP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });
    console.log("[ai/assistant] resposta recebida, stop_reason=", response.stop_reason);
    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ ok: true, reply });
  } catch (err: unknown) {
    const desc = describeError(err);
    console.error("[ai/assistant] modo geral falhou:", desc);
    return NextResponse.json(
      { ok: false, error: "IA indisponível no momento.", detail: desc },
      { status: 502 },
    );
  }
}
