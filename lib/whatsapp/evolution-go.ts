export const EVOLUTION_URL = process.env.EVOLUTION_GO_URL!;
export const EVOLUTION_KEY = process.env.EVOLUTION_GO_API_KEY!;

export async function createInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({ instanceName, integration: "WHATSAPP-BAILEYS" }),
  });
  return res.json();
}

export async function getQRCode(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/${instanceName}/qrcode`, {
    headers: { apikey: EVOLUTION_KEY },
  });
  return res.json();
}

export async function getInstanceStatus(instanceName: string) {
  const url = `${EVOLUTION_URL}/instance/${instanceName}/status`;
  console.log("[evolution-go] getInstanceStatus →", url);
  console.log("[evolution-go] apikey header:", EVOLUTION_KEY ? `${EVOLUTION_KEY.slice(0, 8)}...` : "AUSENTE");

  const res = await fetch(url, {
    headers: { apikey: EVOLUTION_KEY },
  });

  const text = await res.text();
  console.log("[evolution-go] HTTP status:", res.status);
  console.log("[evolution-go] raw response:", text);

  try {
    return JSON.parse(text);
  } catch {
    return { _parseError: true, _rawText: text, _httpStatus: res.status };
  }
}

export async function sendTextMessage(instanceName: string, to: string, text: string) {
  const res = await fetch(`${EVOLUTION_URL}/message/sendText`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({ instanceName, to, text }),
  });
  return res.json();
}

export async function deleteInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/${instanceName}`, {
    method: "DELETE",
    headers: { apikey: EVOLUTION_KEY },
  });
  return res.json();
}
