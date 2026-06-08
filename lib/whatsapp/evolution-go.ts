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
  const url = `${EVOLUTION_URL}/instance/all`;
  console.log("[evolution-go] getInstanceStatus → GET", url, "| buscando:", instanceName);
  console.log("[evolution-go] apikey:", EVOLUTION_KEY ? `${EVOLUTION_KEY.slice(0, 8)}...` : "AUSENTE");

  const res = await fetch(url, { headers: BASE_HEADERS });

  const text = await res.text();
  console.log("[evolution-go] HTTP status:", res.status);
  console.log("[evolution-go] raw response:", text);

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { _parseError: true, _rawText: text, _httpStatus: res.status, state: "unknown" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instances: any[] = (data as any)?.data ?? (Array.isArray(data) ? data : []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = instances.find((i: any) => i.name === instanceName || i.instanceName === instanceName);

  console.log("[evolution-go] instância encontrada:", JSON.stringify(instance ?? null));

  if (!instance) return { state: "not_found" };

  const rawStatus: string = instance.status ?? instance.state ?? "";
  return { state: rawStatus === "open" ? "open" : rawStatus, instance };
}

export async function sendTextMessage(instanceName: string, to: string, text: string) {
  const res = await fetch(`${EVOLUTION_URL}/message/sendText`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ instanceName, to, text }),
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
