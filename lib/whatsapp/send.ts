import { sendTextMessage } from "./evolution-go";

export async function sendWhatsAppText(
  to: string,
  message: string,
  instanceName: string,
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    const data = await sendTextMessage(instanceName, to, message);
    if (data?.error) {
      return { ok: false, error: data.error ?? "Erro na API Evolution GO." };
    }
    return { ok: true, messageId: data?.key?.id };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
