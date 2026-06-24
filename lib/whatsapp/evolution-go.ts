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
    body: JSON.stringify({ name: instanceName, token: instanceName }),
  });
  return res.json();
}

// POST /instance/connect — inicia o pareamento E grava o webhook + eventos.
// É este endpoint (não /instance/{name}/webhook, que retorna 404) que gera o QR
// e persiste o webhook no Evolution GO. apikey = token da instância.
export async function connectInstance(instanceName: string, token?: string) {
  const apikey = token ?? instanceName;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motorgestor.com.br";
  const res = await fetch(`${process.env.EVOLUTION_GO_URL}/instance/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey },
    body: JSON.stringify({
      webhookUrl: `${siteUrl}/api/whatsapp/webhook`,
      subscribe: ["MESSAGE", "CONNECTION"],
      immediate: true,
    }),
  });
  return res.json();
}

// GET /instance/qr — retorna a string base64 do QR (data URI pronta p/ <img src>) ou null.
// token: apikey da instância (definido durante createInstance como o próprio instanceName).
// Evolution GO devolve o QR em { data: { Qrcode: "data:image/png;base64,...", Code } }.
export async function getQRCode(instanceName: string, token?: string): Promise<string | null> {
  const apikey = token ?? instanceName;
  const res = await fetch(
    `${process.env.EVOLUTION_GO_URL}/instance/qr?instanceName=${encodeURIComponent(instanceName)}`,
    { headers: { "Content-Type": "application/json", apikey } },
  );
  const data = await res.json().catch(() => null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;
  return d?.data?.Qrcode ?? d?.qrcode?.base64 ?? d?.base64 ?? null;
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

export async function getInstanceToken(instanceName: string): Promise<string | null> {
  const res = await fetch(`${process.env.EVOLUTION_GO_URL}/instance/all`, {
    headers: { apikey: process.env.EVOLUTION_GO_API_KEY ?? "" },
  });
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instances = ((data as any).data || data || []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = instances.find((i: any) => i.name === instanceName);
  console.log("[evolution-go] getInstanceToken para", instanceName, "→", instance?.token ? `${String(instance.token).slice(0, 8)}...` : "NÃO ENCONTRADO");
  return instance?.token ?? null;
}

export async function sendTextMessage(instanceName: string, to: string, text: string) {
  // Busca o token da instância (usado no header apikey)
  const token = await getInstanceToken(instanceName);
  if (!token) {
    console.error("[evolution-go] sendTextMessage — token da instância não encontrado:", instanceName);
    return { error: "Instance token not found" };
  }

  // Evolution GO quer só o número, sem sufixo @s.whatsapp.net ou @lid
  const number = to.replace(/@.*$/, "");

  const url = `${process.env.EVOLUTION_GO_URL}/send/text`;
  console.log("[evolution-go] sendTextMessage →", url);
  console.log("[evolution-go] number:", number, "| text:", text.slice(0, 50));

  const res = await fetch(url, {
    method: "POST",
    headers: { apikey: token, "Content-Type": "application/json" },
    body: JSON.stringify({ number, text }),
  });

  const responseText = await res.text();
  console.log("[evolution-go] sendTextMessage HTTP:", res.status, responseText.slice(0, 200));

  try {
    return JSON.parse(responseText);
  } catch {
    return { error: responseText, status: res.status };
  }
}

// DELETE /instance/delete/{id} — o Evolution GO exige o UUID (campo `id`), não o nome.
export async function deleteInstance(instanceName: string) {
  const status = await getInstanceStatus(instanceName).catch(() => null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id = (status as any)?.instance?.id as string | undefined;
  if (!id) return { error: "instance not found", instanceName };
  const res = await fetch(`${process.env.EVOLUTION_GO_URL}/instance/delete/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
}
