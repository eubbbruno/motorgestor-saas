"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { LeadFormSchema, type LeadFormValues } from "@/features/leads/schema";
import { useVehicles } from "@/features/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const statusLabels: Record<LeadFormValues["status"], string> = {
  novo: "Novo",
  contato: "Contato",
  visita: "Visita/Test-drive",
  proposta: "Proposta",
  ganho: "Ganho",
  perdido: "Perdido",
};

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
  const busy = Boolean(loading || submitting);

  async function handleSubmit(values: LeadFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="bg-background/60 p-6">
      <div className="text-base font-medium">{title}</div>
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
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Veículo de interesse (opcional)</Label>
              <Select
                value={form.watch("vehicle_id") ?? ""}
                onValueChange={(v) => form.setValue("vehicle_id", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={vehicles.isLoading ? "Carregando..." : "Selecionar veículo"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
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
        </fieldset>
      </form>
    </Card>
  );
}

