import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Suporta tanto { message } (assistente) quanto { leadMessage, vehicleContext, companyName } (legado)
  const userMessage = (body.message ?? body.leadMessage ?? "").trim();

  if (!userMessage) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 500 });
  }

  // Modo legado (lead response com contexto de veículos)
  if (body.vehicleContext || body.companyName) {
    const companyName = body.companyName ?? "MotorGestor";
    const vehicleContext = body.vehicleContext ?? "Nenhum veículo disponível no momento.";
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `Você é um assistente de vendas da concessionária ${companyName}. Responda de forma simpática, direta e profissional. Foque em entender o interesse do cliente e apresentar veículos disponíveis. Nunca invente informações sobre veículos — use apenas o contexto fornecido.`,
      messages: [{ role: "user", content: `Contexto do estoque: ${vehicleContext}\n\nMensagem do lead: ${userMessage}` }],
    });
    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  }

  // Modo assistente geral
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: HELP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });
    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ ok: true, reply });
  } catch (err: unknown) {
    console.error("[ai/assistant]", err);
    return NextResponse.json({ ok: false, error: "IA indisponível no momento." }, { status: 502 });
  }
}
