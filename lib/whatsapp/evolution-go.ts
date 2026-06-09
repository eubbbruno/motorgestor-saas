export const EVOLUTION_URL = process.env.EVOLUTION_GO_URL!;
export const EVOLUTION_KEY = process.env.EVOLUTION_GO_API_KEY!;

// Função em vez de constante — lê process.env em tempo de execução, não no load do módulo
function headers() {
  const key = process.env.EVOLUTION_GO_API_KEY ?? "";
  return {
    "Content-Type": "application/json",
    apikey: key,
  };
}

export async function createInstance(instanceName: string) {
  const res = await fetch(`${process.env.EVOLUTION_GO_URL}/instance/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ instanceName, integration: "WHATSAPP-BAILEYS" }),
  });
  return res.json();
}

export async function getQRCode(instanceName: string) {
  const res = await fetch(
    `${process.env.EVOLUTION_GO_URL}/instance/qr?instanceName=${encodeURIComponent(instanceName)}`,
    { headers: headers() },
  );
  return res.json();
}

// GET /instance/all — busca todas as instâncias e filtra pelo nome
export async function getInstanceStatus(instanceName: string) {
  const res = await fetch(`${process.env.EVOLUTION_GO_URL}/instance/all`, {
    headers: headers(),
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
  const url = `${process.env.EVOLUTION_GO_URL}/send/text`;
  const key = process.env.EVOLUTION_GO_API_KEY ?? "";
  console.log("[evolution-go] sendTextMessage →", url);
  console.log("[evolution-go] apikey:", key ? `${key.slice(0, 8)}...` : "AUSENTE");
  console.log("[evolution-go] payload:", JSON.stringify({ instanceName, to, text: text.slice(0, 50) }));

  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ instanceName, to, text }),
  });

  const responseText = await res.text();
  console.log("[evolution-go] HTTP status:", res.status);
  console.log("[evolution-go] resposta:", responseText.slice(0, 300));

  try {
    return JSON.parse(responseText);
  } catch {
    return { error: responseText || "Resposta vazia do servidor", status: res.status };
  }
}

export async function setWebhook(instanceName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motorgestor.com.br";
  const res = await fetch(
    `${process.env.EVOLUTION_GO_URL}/instance/${encodeURIComponent(instanceName)}/webhook`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        url: `${siteUrl}/api/whatsapp/webhook`,
        events: ["MESSAGE", "CONNECTION", "QRCODE"],
      }),
    },
  );
  return res.json();
}

export async function deleteInstance(instanceName: string) {
  const res = await fetch(
    `${process.env.EVOLUTION_GO_URL}/instance/${encodeURIComponent(instanceName)}`,
    { method: "DELETE", headers: headers() },
  );
  return res.json();
}
