import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "motorgestor_verify_2026";

// GET — verificação do webhook pelo Meta
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verificação falhou." }, { status: 403 });
}

// POST — recebe mensagens do WhatsApp Business
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text?.body ?? "";
    const from = message.from as string; // número do lead (ex: "5511999999999")

    if (!text || !from) {
      return NextResponse.json({ ok: true });
    }

    // TODO: buscar contexto de veículos + nome da concessionária pelo número/lead
    // TODO: chamar /api/ai/assistant para gerar resposta
    // TODO: chamar /api/whatsapp/send para enviar resposta ao lead
    console.log(`[WhatsApp] Mensagem de ${from}: ${text}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[WhatsApp webhook] Erro:", err);
    return NextResponse.json({ ok: true }); // sempre 200 para o Meta
  }
}
