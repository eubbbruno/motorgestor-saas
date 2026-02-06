import { LeadDetailClient } from "@/app/(app)/app/leads/[id]/lead-detail-client";

export default async function LeadDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeadDetailClient id={id} />;
}

