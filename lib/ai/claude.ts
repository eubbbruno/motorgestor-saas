import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateLeadResponse(
  leadMessage: string,
  vehicleContext: string,
  companyName: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: `Você é um assistente de vendas da concessionária ${companyName}. Responda de forma simpática, direta e profissional. Foque em entender o interesse do cliente e apresentar veículos disponíveis. Nunca invente informações sobre veículos — use apenas o contexto fornecido.`,
    messages: [
      {
        role: "user",
        content: `Contexto do estoque: ${vehicleContext}\n\nMensagem do lead: ${leadMessage}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

type AiTrainingContext = {
  store_name: string | null;
  store_description: string | null;
  working_hours: string | null;
  location: string | null;
  payment_methods: string | null;
  warranty_policy: string | null;
  differentials: string | null;
  tone: string;
  custom_faqs: Array<{ question: string; answer: string }>;
  attendant_name?: string | null;
  response_delay_min: number;
  response_delay_max: number;
};

type VehicleContext = {
  title?: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  color: string | null;
  mileage: number | null;
  status: string;
};

type HistoryMessage = {
  direction: string;
  message: string;
};

export async function generateWhatsAppResponse(
  incomingMessage: string,
  conversationHistory: HistoryMessage[],
  training: AiTrainingContext,
  vehicles: VehicleContext[],
): Promise<string> {
  const available = vehicles.filter(v => v.status === "disponivel").slice(0, 20);

  const vehicleContext = available.length
    ? available
        .map(v =>
          `${v.make ?? ""} ${v.model ?? ""} ${v.year ?? ""} - R$ ${v.price?.toLocaleString("pt-BR") ?? "consultar"} - ${v.color ?? ""} - ${v.mileage ?? 0}km`
        )
        .join("\n")
    : "Nenhum veículo disponível no momento.";

  const attendantName = training.attendant_name || "Carlos";
  const toneDesc =
    training.tone === "formal"
      ? "formal e profissional"
      : training.tone === "casual"
        ? "descontraído e jovial"
        : "amigável e próximo";

  const faqText =
    Array.isArray(training.custom_faqs) && training.custom_faqs.length
      ? training.custom_faqs
          .map((f: { question: string; answer: string }) => `P: ${f.question}\nR: ${f.answer}`)
          .join("\n\n")
      : "";

  const systemPrompt = `Você é ${attendantName}, um consultor de vendas da ${training.store_name ?? "nossa loja"}.

SOBRE A LOJA:
${training.store_description ?? "Loja de veículos seminovos."}

HORÁRIO: ${training.working_hours ?? "Segunda a sábado, 9h-18h"}
LOCALIZAÇÃO: ${training.location ?? "Consulte endereço"}
FORMAS DE PAGAMENTO: ${training.payment_methods ?? "Financiamento, consórcio, à vista"}
GARANTIA: ${training.warranty_policy ?? "Consulte condições"}
DIFERENCIAIS: ${training.differentials ?? ""}
${faqText ? `\nPERGUNTAS FREQUENTES:\n${faqText}` : ""}

ESTOQUE DISPONÍVEL:
${vehicleContext}

REGRAS OBRIGATÓRIAS:
- Responda como vendedor humano chamado ${attendantName}, nunca revele que é IA
- Se perguntarem se é robô, diga que é um atendente virtual e que um consultor pode falar em seguida
- Tom de voz: ${toneDesc}
- Mensagens CURTAS — máximo 3 linhas por resposta
- Use emojis com moderação (1-2 por mensagem no máximo)
- Foque em entender o interesse do cliente e apresentar veículos disponíveis
- Se pedirem test drive, colete nome completo e horário preferido
- Se não souber algo específico, diga que vai verificar e retorna em breve
- Nunca invente informações de veículos não listados no estoque`;

  const history = conversationHistory.slice(-10).map(m => ({
    role: m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
    content: m.message,
  }));

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: systemPrompt,
    messages: [...history, { role: "user", content: incomingMessage }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
