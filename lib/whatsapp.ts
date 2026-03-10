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

