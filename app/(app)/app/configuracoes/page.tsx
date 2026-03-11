"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2Icon, Loader2Icon, ShieldCheckIcon, UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useMyProfile, useUpdateMyProfile } from "@/features/auth/hooks";
import { useBillingSummary } from "@/features/billing/hooks";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";

const Schema = z.object({
  full_name: z.string().min(2, "Informe seu nome.").optional(),
});

type Values = z.infer<typeof Schema>;

export default function ConfiguracoesPage() {
  const profile = useMyProfile();
  const update = useUpdateMyProfile();
  const billing = useBillingSummary();

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
  const initials =
    (profile.data?.full_name ?? profile.data?.email ?? "MG")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "MG";

  const company = useQuery({
    queryKey: ["companies", profile.data?.company_id],
    enabled: Boolean(profile.data?.company_id),
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, slug")
        .eq("id", profile.data!.company_id as string)
        .single();
      if (error) throw error;
      return data as { id: string; name: string; slug: string };
    },
  });

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes de conta, empresa e preferências.
        </p>
      </div>

      {profile.isError ? (
        <Card className="bg-background/60 p-6">
          <div className="text-base font-medium">Não foi possível carregar</div>
          <p className="mt-2 text-sm text-destructive">
            Verifique se você está logado e se o Supabase está configurado.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="bg-background/60 p-6 lg:col-span-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <div className="text-base font-medium">Perfil</div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {profile.isLoading ? "Carregando..." : "Atualize seus dados básicos."}
                  </div>
                </div>
              </div>
              {profile.data?.role ? (
                <Badge variant="secondary" className="border bg-background/60 capitalize">
                  <ShieldCheckIcon className="mr-1 size-3" />
                  {profile.data.role}
                </Badge>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">E-mail</div>
                  <div className="truncate text-sm font-medium">
                    {profile.isLoading ? <Skeleton className="h-4 w-40" /> : (profile.data?.email ?? "—")}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Empresa (ID)</div>
                  <div className="truncate text-sm font-medium">
                    {profile.isLoading ? <Skeleton className="h-4 w-40" /> : (profile.data?.company_id ?? "—")}
                  </div>
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

          <Card className="bg-background/60 p-6 lg:col-span-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2Icon className="size-4 text-muted-foreground" />
                  <div className="text-base font-medium">Empresa</div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Plano atual e identificação do tenant.
                </div>
              </div>
              <Badge variant="secondary" className="border bg-background/60">
                {billing.isLoading ? "Carregando..." : billing.data?.plan?.name ?? "Free"}
              </Badge>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Nome da empresa</div>
                  <div className="truncate text-sm font-medium">
                    {company.isLoading ? <Skeleton className="h-4 w-44" /> : company.data?.name ?? "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Slug</div>
                  <div className="truncate text-sm font-medium">
                    {company.isLoading ? <Skeleton className="h-4 w-28" /> : company.data?.slug ?? "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Uso do plano</div>
                  <div className="text-sm text-muted-foreground">
                    {billing.isError
                      ? "Indisponível"
                      : billing.isLoading
                        ? "—"
                        : `${billing.data?.usage.leads ?? 0}/${billing.data?.plan.max_leads ?? 0} leads · ${
                            billing.data?.usage.vehicles ?? 0
                          }/${billing.data?.plan.max_vehicles ?? 0} veículos`}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  (Preparado para billing; upgrade em `/app/billing`.)
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-background/60 p-6 lg:col-span-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium">Preferências</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Ajustes de tema e opções preparadas para evolução.
                </div>
              </div>
              <ThemeToggle />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-background/60 p-4">
                <div className="text-sm font-medium">Tema</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Use o botão no topo para alternar.
                </div>
              </div>

              <div className="rounded-xl border bg-background/60 p-4">
                <div className="text-sm font-medium">Idioma</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Preparado (placeholder).
                </div>
                <div className="mt-3">
                  <Input value="pt-BR" disabled />
                </div>
              </div>

              <div className="rounded-xl border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">Notificações</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Placeholder local (não persiste).
                    </div>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    aria-label="Ativar notificações (placeholder)"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

