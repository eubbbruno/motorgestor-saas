"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const companyName = form.watch("companyName");
  const suggestedSlug = companyName ? slugify(companyName) : "";

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
      router.push("/app");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível concluir o onboarding.", {
        description: getErrorMessage(err) ?? "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vamos configurar sua empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          É rápido. Isso garante multi-tenant e permissões por concessionária.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              placeholder="Ex: Revenda Central"
              {...form.register("companyName")}
            />
            {suggestedSlug ? (
              <p className="text-xs text-muted-foreground">
                Identificador sugerido: <span className="font-mono">{suggestedSlug}</span>
              </p>
            ) : null}
            {form.formState.errors.companyName ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.companyName.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Concluir"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

