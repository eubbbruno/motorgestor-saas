"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMyProfile, useUpdateMyProfile } from "@/features/auth/hooks";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Schema = z.object({
  full_name: z.string().min(2, "Informe seu nome.").optional(),
});

type Values = z.infer<typeof Schema>;

export default function ConfiguracoesPage() {
  const profile = useMyProfile();
  const update = useUpdateMyProfile();

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { full_name: "" },
  });

  React.useEffect(() => {
    if (profile.data) {
      form.reset({ full_name: profile.data.full_name ?? "" });
    }
  }, [profile.data, form]);

  async function onSubmit(values: Values) {
    try {
      await update.mutateAsync({ full_name: values.full_name ?? null });
      toast.success("Configurações salvas.");
    } catch {
      toast.error("Não foi possível salvar.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes de conta e informações básicas.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <div className="text-base font-medium">Minha conta</div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-4 md:max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome</Label>
            <Input id="full_name" placeholder="Seu nome" {...form.register("full_name")} />
            {form.formState.errors.full_name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.full_name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Papel</div>
              <div className="text-sm font-medium capitalize">
                {profile.data?.role ?? "—"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Empresa</div>
              <div className="truncate text-sm font-medium">
                {profile.data?.company_id ?? "—"}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={update.isPending || profile.isLoading}>
            {update.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

