import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  plate: z.string().optional(),
  chassis: z.string().optional(),
  renavam: z.string().optional(),
});

function normalizePlate(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => null);
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  }

  const plate = normalizePlate(parsed.data.plate ?? "");
  const chassis = (parsed.data.chassis ?? "").trim();
  const renavam = (parsed.data.renavam ?? "").trim();

  if (!plate && !chassis && !renavam) {
    return NextResponse.json(
      { ok: false, error: "Informe placa, chassi ou renavam." },
      { status: 400 },
    );
  }

  const provider = (process.env.VEHICLE_LOOKUP_PROVIDER ?? "mock").toLowerCase();

  // Importante: não existe uma API pública oficial/estável sem chave para esse tipo de consulta.
  // Este endpoint fica "preparado" e não quebra o fluxo quando não há provedor configurado.
  if (provider === "mock") {
    // Retorno determinístico “demo” só para validar UX.
    const hint = plate || chassis.slice(0, 6) || renavam.slice(0, 6);
    const isToyota = hint.endsWith("A") || hint.endsWith("1");
    return NextResponse.json({
      ok: true,
      make: isToyota ? "Toyota" : "Volkswagen",
      model: isToyota ? "Corolla" : "Gol",
      year: 2020,
      version: isToyota ? "XEi 2.0 AT" : "1.6",
      fuel: "Flex",
    });
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "Busca por placa/chassi/renavam não configurada. Defina VEHICLE_LOOKUP_PROVIDER e as credenciais do provedor.",
    },
    { status: 501 },
  );
}

