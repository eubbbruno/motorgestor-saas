export function formatWhatsAppNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (digits.length < 10) return null;

  // BR default: add DDI 55 when missing
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  // fallback: already international-ish
  return digits;
}

export function buildWhatsAppLink(args: {
  phone: string | null | undefined;
  text?: string | null;
}): string | null {
  const number = formatWhatsAppNumber(args.phone);
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  const text = (args.text ?? "").trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function buildLeadWhatsAppText(args: {
  leadName: string;
  vehicleTitle?: string | null;
}): string {
  const name = (args.leadName ?? "").trim() || "tudo bem";
  const vehicle = (args.vehicleTitle ?? "").trim();
  if (vehicle) {
    return `Olá ${name}, vi seu interesse no veículo ${vehicle}. Posso te ajudar?`;
  }
  return `Olá ${name}, vi seu interesse. Posso te ajudar?`;
}

function firstName(name: string) {
  const n = (name ?? "").trim();
  if (!n) return "";
  return n.split(/\s+/)[0] ?? n;
}

export type WhatsAppLeadTemplateKey =
  | "initial"
  | "follow_up"
  | "proposal"
  | "schedule"
  | "hot"
  | "objection_price";

export function buildLeadWhatsAppTemplateText(args: {
  template: WhatsAppLeadTemplateKey;
  leadName: string;
  vehicleTitle?: string | null;
}): string {
  const full = (args.leadName ?? "").trim();
  const name = firstName(full) || "tudo bem";
  const vehicle = (args.vehicleTitle ?? "").trim();

  if (args.template === "schedule") {
    return vehicle
      ? `Oi ${name}! Podemos agendar uma visita/test drive do ${vehicle}? Prefere hoje ou amanhã — manhã ou tarde?`
      : `Oi ${name}! Podemos agendar uma visita/test drive? Prefere hoje ou amanhã — manhã ou tarde?`;
  }

  if (args.template === "hot") {
    return vehicle
      ? `Oi ${name}! O ${vehicle} ainda está disponível. Quer que eu te mande fotos/condições e já deixo separado pra você ver hoje?`
      : `Oi ${name}! Ainda consigo te ajudar hoje. Quer que eu te mande fotos/condições e já deixo separado pra você ver?`;
  }

  if (args.template === "objection_price") {
    return vehicle
      ? `Entendi, ${name}. Se o preço for o ponto principal no ${vehicle}, me diz: você busca mais “menor parcela” ou “menor entrada”? Eu te mando duas opções pra comparar.`
      : `Entendi, ${name}. Se o preço for o ponto principal, você busca mais “menor parcela” ou “menor entrada”? Eu te mando duas opções pra comparar.`;
  }

  if (args.template === "follow_up") {
    return vehicle
      ? `Oi ${name}! Só passando pra não deixar sua pesquisa esfriar. Você ainda tem interesse no ${vehicle}? Se quiser, eu te mando 2 opções e já agendamos uma visita.`
      : `Oi ${name}! Só passando pra não deixar sua pesquisa esfriar. Você ainda tem interesse? Se quiser, eu te mando 2 opções e já agendamos uma visita.`;
  }

  if (args.template === "proposal") {
    return vehicle
      ? `Perfeito, ${name}. Posso te enviar uma proposta do ${vehicle} (PDF) com condições e próximos passos?`
      : `Perfeito, ${name}. Posso te enviar uma proposta (PDF) com condições e próximos passos?`;
  }

  // initial
  return vehicle
    ? `Oi ${name}! Vi seu interesse no ${vehicle}. Posso te mandar fotos, condições e já te dizer o que precisa pra fechar?`
    : `Oi ${name}! Vi seu interesse. Posso te mandar fotos, condições e já te dizer o que precisa pra fechar?`;
}

export async function copyTextToClipboard(text: string) {
  const value = (text ?? "").toString();
  if (!value) return;

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // fallback abaixo
  }

  // Fallback simples
  const el = document.createElement("textarea");
  el.value = value;
  el.setAttribute("readonly", "true");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

