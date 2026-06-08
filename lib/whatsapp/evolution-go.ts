export const EVOLUTION_URL = process.env.EVOLUTION_GO_URL!;
export const EVOLUTION_KEY = process.env.EVOLUTION_GO_API_KEY!;

const BASE_HEADERS = {
  "Content-Type": "application/json",
  apikey: EVOLUTION_KEY,
};

export async function createInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ instanceName, integration: "WHATSAPP-BAILEYS" }),
  });
  return res.json();
}

export async function getQRCode(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/qr?instanceName=${encodeURIComponent(instanceName)}`, {
    headers: BASE_HEADERS,
  });
  return res.json();
}

// GET /instance/all — busca todas as instâncias e filtra pelo nome
export async function getInstanceStatus(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/all`, {
    headers: { apikey: EVOLUTION_KEY, "Content-Type": "application/json" },
  });
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instances = ((data as any).data || data || []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = instances.find((i: any) => i.name === instanceName);
  if (!instance) return { state: "not_found" };
  const connected = instance.connected === true;
  return { state: connected ? "open" : "close", instance };
}

export async function sendTextMessage(instanceName: string, to: string, text: string) {
  const res = await fetch(`${EVOLUTION_URL}/message/sendText`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ instanceName, to, text }),
  });
  return res.json();
}

export async function setWebhook(instanceName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motorgestor.com.br";
  const res = await fetch(`${EVOLUTION_URL}/instance/${encodeURIComponent(instanceName)}/webhook`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({
      url: `${siteUrl}/api/whatsapp/webhook`,
      events: ["MESSAGE", "CONNECTION", "QRCODE"],
    }),
  });
  return res.json();
}

export async function deleteInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/${encodeURIComponent(instanceName)}`, {
    method: "DELETE",
    headers: BASE_HEADERS,
  });
  return res.json();
}
