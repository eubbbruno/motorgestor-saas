import { VehicleDetailClient } from "@/app/(app)/app/veiculos/[id]/vehicle-detail-client";

export default async function VeiculoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VehicleDetailClient id={id} />;
}

