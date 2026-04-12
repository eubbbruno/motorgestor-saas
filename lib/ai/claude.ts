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
    model: "claude-sonnet-4-20250514",
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
