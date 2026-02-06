"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Corolla XEi 2.0 AT 2020"
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
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
              placeholder="2020"
              {...form.register("year", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">KM</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="45000"
              {...form.register("mileage", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="129900"
              {...form.register("price", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(v) => form.setValue("status", v as VehicleFormValues["status"])}
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
            <Input id="transmission" placeholder="Automático" {...form.register("transmission")} />
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
          {busy ? "Salvando..." : submitLabel}
        </Button>
      </form>
    </Card>
  );
}

