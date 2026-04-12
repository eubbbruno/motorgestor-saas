import { NextRequest, NextResponse } from "next/server";
import { generateLeadResponse } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  const { leadMessage, vehicleContext, companyName } = await req.json();

  if (!leadMessage) {
    return NextResponse.json(
      { error: "Campo 'leadMessage' é obrigatório." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada." },
      { status: 500 }
    );
  }

  const reply = await generateLeadResponse(
    leadMessage,
    vehicleContext ?? "Nenhum veículo disponível no momento.",
    companyName ?? "MotorGestor"
  );

  return NextResponse.json({ reply });
}
