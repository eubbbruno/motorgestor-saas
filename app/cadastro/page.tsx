"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { getHumanErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Schema = z.object({
  fullName: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type FormValues = z.infer<typeof Schema>;

export default function CadastroPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: values.fullName,
          email: values.email,
          role: "admin",
        });
        if (profileError) {
          // Não bloqueia o cadastro: perfil pode ser criado via SQL trigger/edge function em setups avançados.
          console.warn(profileError);
        }
      }

      toast.success("Conta criada! Vamos configurar sua empresa.");
      router.push("/app");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Não foi possível criar sua conta.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece em minutos com estoque, leads e agenda prontos para operar.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={loading} aria-busy={loading} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome</Label>
              <Input
                id="fullName"
                placeholder="Seu nome"
                autoComplete="name"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                aria-describedby={form.formState.errors.fullName ? "fullName-error" : undefined}
                className={form.formState.errors.fullName ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName ? (
                <p id="fullName-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.fullName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com"
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(form.formState.errors.password)}
                aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                className={form.formState.errors.password ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p id="password-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </fieldset>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Entrar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

