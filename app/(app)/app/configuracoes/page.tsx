"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

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

  const busy = profile.isLoading || update.isPending;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes de conta e informações básicas.
        </p>
      </div>

      {profile.isError ? (
        <Card className="bg-background/60 p-6">
          <div className="text-base font-medium">Minha conta</div>
          <p className="mt-2 text-sm text-destructive">
            Não foi possível carregar suas informações. Verifique se você está logado e se o Supabase está configurado.
          </p>
        </Card>
      ) : (
        <Card className="bg-background/60 p-6">
          <div className="text-base font-medium">Minha conta</div>

          <div className="mt-4 grid gap-4 md:max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">E-mail</div>
                <div className="truncate text-sm font-medium">{profile.data?.email ?? "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Papel</div>
                <div className="text-sm font-medium capitalize">{profile.data?.role ?? "—"}</div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="text-xs text-muted-foreground">Empresa (ID)</div>
                <div className="truncate text-sm font-medium">{profile.data?.company_id ?? "—"}</div>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <fieldset disabled={busy} aria-busy={busy} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome</Label>
                  <Input id="full_name" placeholder="Seu nome" {...form.register("full_name")} />
                  {form.formState.errors.full_name ? (
                    <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                  ) : null}
                </div>

                <Button type="submit" disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </fieldset>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}

