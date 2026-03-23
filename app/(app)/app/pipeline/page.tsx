"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2Icon, MessageCircleIcon } from "lucide-react";

import { useLeads, useUpdateLeadStatus } from "@/features/leads/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import type { LeadRow } from "@/types/models";
import { buildLeadWhatsAppText, buildWhatsAppLink } from "@/lib/whatsapp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";

const columns = [
  { key: "novo", title: "Novo" },
  { key: "contato", title: "Contato" },
  { key: "proposta", title: "Proposta" },
  { key: "negociacao", title: "Negociação" },
  { key: "fechado", title: "Fechado" },
  { key: "perdido", title: "Perdido" },
] as const;

type PipelineStatus = (typeof columns)[number]["key"];

function normalizeStatus(status: LeadRow["status"]): PipelineStatus {
  if (status === "visita") return "negociacao";
  if (status === "ganho") return "fechado";
  if (
    status === "novo" ||
    status === "contato" ||
    status === "proposta" ||
    status === "negociacao" ||
    status === "fechado" ||
    status === "perdido"
  ) {
    return status;
  }
  return "novo";
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelinePage() {
  const leads = useLeads();
  const vehicles = useVehicles();
  const updateStatus = useUpdateLeadStatus();

  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [movingId, setMovingId] = React.useState<string | null>(null);

  const vehicleById = React.useMemo(() => {
    const map = new Map<string, { title: string; fipe_value?: number | null }>();
    (vehicles.data ?? []).forEach((v) => {
      map.set(v.id, { title: v.title, fipe_value: v.fipe_value ?? null });
    });
    return map;
  }, [vehicles.data]);

  const grouped = React.useMemo(() => {
    const map = new Map<PipelineStatus, LeadRow[]>();
    columns.forEach((c) => map.set(c.key, []));
    (leads.data ?? []).forEach((l) => {
      const s = normalizeStatus(l.status);
      map.get(s)?.push(l);
    });
    // ordena por mais recente
    map.forEach((list) =>
      list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    );
    return map;
  }, [leads.data]);

  function onDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd() {
    setDraggingId(null);
  }

  async function onDrop(e: React.DragEvent, status: PipelineStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    if (movingId) return;

    const lead = (leads.data ?? []).find((l) => l.id === id);
    if (!lead) return;

    const current = normalizeStatus(lead.status);
    if (current === status) return;

    setMovingId(id);
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status atualizado.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Tente novamente.";
      toast.error("Não foi possível mover o lead.", { description: message });
    } finally {
      setMovingId(null);
      setDraggingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Vendas"
        title="Pipeline"
        description="Arraste leads entre etapas para atualizar o funil."
        right={
          <Button asChild variant="outline" className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
            <Link href="/app/leads/novo">Novo lead</Link>
          </Button>
        }
      />

      {leads.isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando pipeline...</div>
      ) : leads.isError ? (
        <div className="text-sm text-destructive">Não foi possível carregar os leads.</div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex min-w-6xl gap-4 pb-2">
            {columns.map((col) => {
              const list = grouped.get(col.key) ?? [];
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => void onDrop(e, col.key)}
                  className="w-[18rem] shrink-0"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">{col.title}</div>
                    <div className="text-xs text-mg-fg-muted">{list.length}</div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-mg-border bg-mg-surface/60 p-3 backdrop-blur">
                    {list.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-mg-border bg-mg-surface/40 p-4 text-xs text-mg-fg-muted">
                        Arraste um lead para cá.
                      </div>
                    ) : null}

                    {list.map((l) => {
                      const v = l.vehicle_id ? vehicleById.get(l.vehicle_id) : null;
                      const link = buildWhatsAppLink({
                        phone: l.phone,
                        text: buildLeadWhatsAppText({ leadName: l.name, vehicleTitle: v?.title ?? null }),
                      });
                      const isMoving = movingId === l.id;
                      const isDragging = draggingId === l.id;

                      return (
                        <Card
                          key={l.id}
                          draggable={!isMoving}
                          onDragStart={(e) => onDragStart(e, l.id)}
                          onDragEnd={onDragEnd}
                          className={[
                            "rounded-2xl border-mg-border bg-mg-surface-2/70 p-3 shadow-sm backdrop-blur transition",
                            isDragging ? "opacity-70 ring-2 ring-emerald-400/25" : "",
                            isMoving ? "opacity-60" : "hover:bg-mg-surface-2/85 hover:shadow-md",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-foreground">{l.name}</div>
                              <div className="mt-1 text-xs text-mg-fg-muted">
                                {v?.title ? v.title : "Sem veículo"}
                              </div>
                              {v?.fipe_value != null ? (
                                <div className="mt-1 text-xs text-mg-fg-muted">
                                  FIPE:{" "}
                                  <span className="font-medium text-foreground">
                                    {formatBRL(Number(v.fipe_value))}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-2">
                              {link ? (
                                <Button asChild variant="ghost" size="icon" aria-label="Conversar no WhatsApp">
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300"
                                  >
                                    <MessageCircleIcon className="size-4" />
                                  </a>
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" disabled aria-label="WhatsApp indisponível">
                                  <MessageCircleIcon className="size-4" />
                                </Button>
                              )}

                              {isMoving ? (
                                <Loader2Icon className="size-4 animate-spin text-mg-fg-muted" />
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

