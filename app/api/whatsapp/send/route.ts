import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_API_URL = "https://graph.facebook.com/v19.0";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  if (!to || !message) {
    return NextResponse.json(
      { error: "Campos 'to' e 'message' são obrigatórios." },
      { status: 400 }
    );
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token) {
    return NextResponse.json(
      { error: "Variáveis de ambiente WhatsApp não configuradas." },
      { status: 500 }
    );
  }

  const res = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error("[WhatsApp send] Erro:", error);
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}
