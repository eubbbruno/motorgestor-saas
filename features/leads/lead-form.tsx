"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { LeadFormSchema, type LeadFormValues } from "@/features/leads/schema";
import { useVehicles } from "@/features/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusLabels: Record<LeadFormValues["status"], string> = {
  novo: "Novo",
  contato: "Contato",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
  visita: "Visita/Test-drive (legado)",
  ganho: "Ganho (legado)",
};

const pipelineStatuses = [
  "novo",
  "contato",
  "proposta",
  "negociacao",
  "fechado",
  "perdido",
] as const;

export function LeadForm({
  title,
  submitLabel,
  defaultValues,
  onSubmit,
  loading,
}: {
  title: string;
  submitLabel: string;
  defaultValues?: Partial<LeadFormValues>;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  loading?: boolean;
}) {
  const vehicles = useVehicles();
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "",
      status: "novo",
      vehicle_id: "",
      notes: "",
      ...defaultValues,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [aiShort, setAiShort] = React.useState<string>("");
  const [aiLong, setAiLong] = React.useState<string>("");
  const busy = Boolean(loading || submitting);
  const busyAi = Boolean(busy || aiLoading);

  async function handleSubmit(values: LeadFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  async function generateWhatsapp() {
    if (busyAi) return;

    const leadName = (form.getValues("name") ?? "").trim();
    if (!leadName) {
      toast.error("Informe o nome do lead para gerar a mensagem.");
      return;
    }

    const vehicleId = form.getValues("vehicle_id") ?? "";
    const vehicleTitle =
      vehicleId && vehicleId.length > 0
        ? (vehicles.data ?? []).find((v) => v.id === vehicleId)?.title ?? null
        : null;

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/lead-whatsapp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadName,
          vehicleTitle,
          source: (form.getValues("source") ?? "").trim() || null,
          status: (form.getValues("status") ?? "").toString() || null,
        }),
      });

      const body = (await res.json().catch(() => null)) as
        | { ok: true; short: string; long: string }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "IA indisponível.");
      }

      if (!mountedRef.current) return;
      setAiShort(body.short);
      setAiLong(body.long);
      setAiOpen(true);
      toast.success("Mensagem gerada.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "IA indisponível.";
      toast.error("Não foi possível gerar a mensagem.", { description: message });
    } finally {
      if (mountedRef.current) setAiLoading(false);
    }
  }

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-base font-medium text-foreground">{title}</div>
        <div className="text-xs text-mg-fg-muted">
          Campos essenciais primeiro. Você pode completar detalhes depois.
        </div>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
        <fieldset disabled={busy} aria-busy={busy} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Nome do cliente"
                autoComplete="name"
                aria-invalid={Boolean(form.formState.errors.name)}
                aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                className={form.formState.errors.name ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p id="name-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                inputMode="tel"
                autoComplete="tel"
                {...form.register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                autoComplete="email"
                aria-invalid={Boolean(form.formState.errors.email)}
                aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p id="email-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Input
                id="source"
                placeholder="Instagram, Indicação, OLX..."
                {...form.register("source")}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as LeadFormValues["status"], { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {pipelineStatuses.map((value) => (
                    <SelectItem key={value} value={value}>
                      {statusLabels[value]}
                    </SelectItem>
                  ))}

                  {form.watch("status") === "visita" ? (
                    <SelectItem value="visita">{statusLabels.visita}</SelectItem>
                  ) : null}
                  {form.watch("status") === "ganho" ? (
                    <SelectItem value="ganho">{statusLabels.ganho}</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Veículo de interesse (opcional)</Label>
              <Select
                value={form.watch("vehicle_id") || "__none__"}
                onValueChange={(v) =>
                  form.setValue("vehicle_id", v === "__none__" ? "" : v, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={vehicles.isLoading ? "Carregando..." : "Selecionar veículo"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {(vehicles.data ?? []).map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.vehicle_id ? (
                <p className="text-xs text-destructive" role="alert">
                  {form.formState.errors.vehicle_id.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              rows={5}
              placeholder="Preferências, objeções, detalhes e próximos passos..."
              {...form.register("notes")}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="w-full border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
              onClick={generateWhatsapp}
              disabled={busyAi}
            >
              {busyAi ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Gerando mensagem...
                </>
              ) : (
                "Gerar mensagem WhatsApp"
              )}
            </Button>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </fieldset>
      </form>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mensagem para WhatsApp</DialogTitle>
            <DialogDescription>
              Copie e cole no WhatsApp. Ajuste o tom conforme necessário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Versão curta</div>
              <div className="rounded-md border bg-background/60 p-3 text-sm whitespace-pre-wrap">
                {aiShort}
              </div>
              <Button variant="outline" className="w-full" onClick={() => copyToClipboard(aiShort)} disabled={!aiShort}>
                Copiar versão curta
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Versão longa</div>
              <div className="rounded-md border bg-background/60 p-3 text-sm whitespace-pre-wrap">
                {aiLong}
              </div>
              <Button variant="outline" className="w-full" onClick={() => copyToClipboard(aiLong)} disabled={!aiLong}>
                Copiar versão longa
              </Button>
            </div>
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
      </Card>
    </PremiumSurface>
  );
}

