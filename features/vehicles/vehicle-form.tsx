"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { VehicleFormSchema, type VehicleFormValues } from "@/features/vehicles/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const statusLabels: Record<VehicleFormValues["status"], string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  inativo: "Inativo",
};

export function VehicleForm({
  title,
  submitLabel,
  defaultValues,
  onSubmit,
  loading,
}: {
  title: string;
  submitLabel: string;
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<void> | void;
  loading?: boolean;
}) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(VehicleFormSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      year: undefined,
      price: undefined,
      mileage: undefined,
      fuel: "",
      transmission: "",
      color: "",
      status: "disponivel",
      notes: "",
      ...defaultValues,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(values: VehicleFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  const busy = Boolean(loading || submitting);

  return (
    <Card className="bg-background/60 p-6">
      <div className="text-base font-medium">{title}</div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
        <fieldset disabled={busy} aria-busy={busy} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Corolla XEi 2.0 AT 2020"
                aria-invalid={Boolean(form.formState.errors.title)}
                aria-describedby={form.formState.errors.title ? "title-error" : undefined}
                className={form.formState.errors.title ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p id="title-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Marca</Label>
              <Input id="make" placeholder="Toyota" {...form.register("make")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" placeholder="Corolla" {...form.register("model")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                inputMode="numeric"
                placeholder="2020"
                aria-invalid={Boolean(form.formState.errors.year)}
                aria-describedby={form.formState.errors.year ? "year-error" : undefined}
                className={form.formState.errors.year ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("year", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.year ? (
                <p id="year-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.year.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">KM</Label>
              <Input
                id="mileage"
                type="number"
                inputMode="numeric"
                placeholder="45000"
                aria-invalid={Boolean(form.formState.errors.mileage)}
                aria-describedby={form.formState.errors.mileage ? "mileage-error" : undefined}
                className={form.formState.errors.mileage ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("mileage", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.mileage ? (
                <p id="mileage-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.mileage.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="129900"
                aria-invalid={Boolean(form.formState.errors.price)}
                aria-describedby={form.formState.errors.price ? "price-error" : undefined}
                className={form.formState.errors.price ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("price", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.price ? (
                <p id="price-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.price.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as VehicleFormValues["status"], {
                    shouldValidate: true,
                  })
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

            <div className="space-y-2">
              <Label htmlFor="fuel">Combustível</Label>
              <Input id="fuel" placeholder="Flex" {...form.register("fuel")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Câmbio</Label>
              <Input
                id="transmission"
                placeholder="Automático"
                {...form.register("transmission")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" placeholder="Prata" {...form.register("color")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              rows={5}
              placeholder="Histórico, opcionais, detalhes de negociação..."
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

