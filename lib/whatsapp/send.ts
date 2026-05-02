const META_API = "https://graph.facebook.com/v25.0";

export async function sendWhatsAppText(
  to: string,
  message: string,
  token: string,
  phoneNumberId: string,
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const res = await fetch(`${META_API}/${phoneNumberId}/messages`, {
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
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err?.error?.message ?? "Erro na API do Meta." };
  }

  const data = await res.json();
  return { ok: true, messageId: data?.messages?.[0]?.id };
}
