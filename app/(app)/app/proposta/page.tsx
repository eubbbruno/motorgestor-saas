import { notFound, redirect } from "next/navigation";

import { getUserAndProfile } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProposalPrintActions } from "@/components/app/proposal-print-actions";

function formatCurrencyBRL(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(value);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PropostaPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; vehicleId?: string }>;
}) {
  const { leadId, vehicleId } = await searchParams;

  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login");
  if (!profile?.company_id) redirect("/app/onboarding");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Proposta</h1>
        <p className="text-sm text-muted-foreground">
          Supabase não configurado. Configure as variáveis de ambiente para gerar propostas.
        </p>
      </div>
    );
  }

  if (!leadId && !vehicleId) notFound();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", profile.company_id)
    .maybeSingle();

  const now = new Date();

  let lead:
    | {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        vehicle_id: string | null;
        notes: string | null;
      }
    | null = null;

  let vehicle:
    | {
        id: string;
        title: string;
        make: string | null;
        model: string | null;
        year: number | null;
        fipe_value: number | null;
        fipe_reference: string | null;
        description_ai: string | null;
        notes: string | null;
      }
    | null = null;

  if (leadId) {
    const { data: leadRow, error } = await supabase
      .from("leads")
      .select("id, name, phone, email, vehicle_id, notes")
      .eq("id", leadId)
      .single();
    if (error || !leadRow) notFound();
    lead = leadRow;

    if (leadRow.vehicle_id) {
      const { data: vRow, error: vErr } = await supabase
        .from("vehicles")
        .select("id, title, make, model, year, fipe_value, fipe_reference, description_ai, notes")
        .eq("id", leadRow.vehicle_id)
        .single();
      if (!vErr && vRow) vehicle = vRow;
    }
  } else if (vehicleId) {
    const { data: vRow, error } = await supabase
      .from("vehicles")
      .select("id, title, make, model, year, fipe_value, fipe_reference, description_ai, notes")
      .eq("id", vehicleId)
      .single();
    if (error || !vRow) notFound();
    vehicle = vRow;
  }

  const description = (vehicle?.description_ai ?? "").trim() || (vehicle?.notes ?? "").trim() || null;

  return (
    <div className="space-y-6">
      <ProposalPrintActions />

      <div className="rounded-xl border bg-white p-8 text-zinc-900 shadow-sm print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight">Proposta Comercial</div>
            <div className="text-sm text-zinc-600">Data: {formatDate(now)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{company?.name ?? "MotorGestor"}</div>
            <div className="text-xs text-zinc-600">{profile.email ?? user.email}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Cliente / Lead
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="text-base font-semibold">
                {lead?.name ?? "—"}
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                {lead ? (
                  <>
                    {lead.phone ? <div>Telefone: {lead.phone}</div> : null}
                    {lead.email ? <div>Email: {lead.email}</div> : null}
                  </>
                ) : (
                  <div className="text-zinc-600">Proposta gerada a partir de um veículo.</div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Veículo</div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="text-base font-semibold">{vehicle?.title ?? "—"}</div>
              <div className="mt-1 text-sm text-zinc-700">
                {subtitleLine(vehicle?.make, vehicle?.model, vehicle?.year)}
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Valor FIPE</span>
                  <span className="font-medium">
                    {vehicle?.fipe_value ? formatCurrencyBRL(vehicle.fipe_value) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Referência</span>
                  <span className="font-medium">{vehicle?.fipe_reference ?? "—"}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Descrição</div>
          <div className="rounded-lg border border-zinc-200 p-4 text-sm leading-relaxed text-zinc-800">
            {description ? (
              <div className="whitespace-pre-wrap">{description}</div>
            ) : (
              <div className="text-zinc-600">Sem descrição.</div>
            )}
          </div>
        </section>

        <section className="mt-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Observações
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-700">
            <div>
              Esta proposta é uma referência inicial e pode ser ajustada conforme negociação e
              condições comerciais.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function subtitleLine(make: string | null | undefined, model: string | null | undefined, year: number | null | undefined) {
  const parts: string[] = [];
  if (make) parts.push(make);
  if (model) parts.push(model);
  if (year) parts.push(String(year));
  return parts.length ? parts.join(" · ") : "—";
}

