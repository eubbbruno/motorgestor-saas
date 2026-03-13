"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2Icon, Loader2Icon, PartyPopperIcon, ArrowRightIcon } from "lucide-react";

import { getHumanErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Schema = z.object({
  companyName: z.string().min(2, "Informe o nome da sua empresa."),
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type FormValues = z.infer<typeof Schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { companyName: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const [statusLoading, setStatusLoading] = React.useState(true);
  const [companyId, setCompanyId] = React.useState<string | null>(null);
  const [vehicles, setVehicles] = React.useState(0);
  const [leads, setLeads] = React.useState(0);
  const completed = vehicles > 0 && leads > 0;
  const companyName = form.watch("companyName");
  const suggestedSlug = companyName ? slugify(companyName) : "";

  async function refreshStatus() {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/onboarding/status", { method: "GET" });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; companyId: string | null; vehicles: number; leads: number; completed: boolean }
        | { ok: false; error: string };
      if (!res.ok || !body || body.ok === false) throw new Error(body && "error" in body ? body.error : "Falha.");
      setCompanyId(body.companyId);
      setVehicles(Number(body.vehicles ?? 0));
      setLeads(Number(body.leads ?? 0));
    } catch {
      // não bloqueia UI
    } finally {
      setStatusLoading(false);
    }
  }

  React.useEffect(() => {
    void refreshStatus();
  }, []);

  React.useEffect(() => {
    if (!statusLoading && completed) {
      router.replace("/app");
      router.refresh();
    }
  }, [completed, router, statusLoading]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sessão inválida. Faça login novamente.");

      const res = await fetch("/api/onboarding/company", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.companyName,
          slug: suggestedSlug || slugify(values.companyName),
        }),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; companyId: string }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "Falha ao criar empresa.");
      }

      toast.success("Empresa configurada. Bora vender!");
      await refreshStatus();
      router.push("/app/veiculos/novo");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível concluir o onboarding.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Configure sua empresa e faça o primeiro cadastro para começar a operar.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="text-sm font-medium">Progresso</div>
            <div className="space-y-2 text-sm">
              <Step ok={Boolean(companyId)} label="Empresa criada" />
              <Step ok={vehicles > 0} label="Primeiro veículo" />
              <Step ok={leads > 0} label="Primeiro lead" />
              <Step ok={leads > 0} label="Pipeline" />
            </div>
            <div className="text-xs text-muted-foreground">
              {statusLoading ? "Carregando status..." : `Veículos: ${vehicles} · Leads: ${leads}`}
            </div>
          </div>

          <div className="space-y-4">
            {!companyId ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">1) Criar empresa</div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <fieldset disabled={loading} aria-busy={loading} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da empresa</Label>
                      <Input
                        id="companyName"
                        placeholder="Ex: Revenda Central"
                        autoComplete="organization"
                        aria-invalid={Boolean(form.formState.errors.companyName)}
                        aria-describedby={form.formState.errors.companyName ? "companyName-error" : undefined}
                        className={form.formState.errors.companyName ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                        {...form.register("companyName")}
                      />
                      {suggestedSlug ? (
                        <p className="text-xs text-muted-foreground">
                          Identificador sugerido: <span className="font-mono">{suggestedSlug}</span>
                        </p>
                      ) : null}
                      {form.formState.errors.companyName ? (
                        <p id="companyName-error" className="text-xs text-destructive" role="alert">
                          {form.formState.errors.companyName.message}
                        </p>
                      ) : null}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2Icon className="mr-2 size-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Criar empresa"
                      )}
                    </Button>
                  </fieldset>
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium">Próximos passos</div>
                <div className="grid gap-2">
                  <Button asChild variant={vehicles > 0 ? "outline" : "default"}>
                    <Link href="/app/veiculos/novo">
                      2) Cadastrar primeiro veículo <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant={leads > 0 ? "outline" : "default"}>
                    <Link href="/app/leads/novo">
                      3) Criar primeiro lead <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/app/pipeline">
                      4) Ver pipeline <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <PartyPopperIcon className="size-4 text-muted-foreground" />
                    Finalização
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quando você tiver pelo menos 1 veículo e 1 lead, o MotorGestor libera o dashboard automaticamente.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button type="button" variant="outline" onClick={() => void refreshStatus()} disabled={statusLoading}>
                      {statusLoading ? "Atualizando..." : "Atualizar progresso"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (completed) {
                          router.replace("/app");
                          router.refresh();
                        } else {
                          toast.error("Ainda falta concluir o onboarding.");
                        }
                      }}
                      disabled={!completed}
                    >
                      Ir para o dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Step({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2Icon className={ok ? "size-4 text-emerald-500" : "size-4 text-muted-foreground/40"} />
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

