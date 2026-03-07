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
  const [oauthLoading, setOauthLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setFormError(null);
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
      setFormError(getHumanErrorMessage(err) ?? "Tente novamente em instantes.");
      toast.error("Não foi possível criar sua conta.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setOauthLoading(true);
    setFormError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(
        /\/$/,
        "",
      );
      const redirectToUrl = `${siteUrl}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectToUrl },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setFormError(getHumanErrorMessage(err) ?? "Tente novamente em instantes.");
      toast.error("Não foi possível continuar com Google.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente em instantes.",
      });
      setOauthLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_30%_0%,rgba(59,130,246,.10),transparent_55%),radial-gradient(900px_circle_at_70%_30%,rgba(16,185,129,.10),transparent_55%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[420px] items-center px-4 py-14">
        <div className="w-full space-y-6">
          <div className="space-y-2 text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              MotorGestor
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Criar sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Crie sua conta e comece a organizar estoque, leads e agenda em minutos.
            </p>
          </div>

          <Card className="rounded-xl border bg-background/70 p-7 shadow-sm backdrop-blur">
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center bg-background/60"
                onClick={onGoogle}
                disabled={loading || oauthLoading}
              >
                {oauthLoading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="mr-2 size-4"
                    >
                      <path
                        fill="currentColor"
                        d="M21.35 11.1H12v2.9h5.35c-.7 3.25-4.15 4.95-7.2 3.45a6.04 6.04 0 0 1-3.3-3.55 6.05 6.05 0 0 1 1.4-6.1 6.2 6.2 0 0 1 8.55-.2l2-2A8.94 8.94 0 0 0 3.1 9.7a9.01 9.01 0 0 0 4.85 12.7c4.85 2.55 11.8.1 13.25-6.2.15-.7.15-1.45.15-2.2 0-.6-.05-1.25-.1-1.9Z"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </Button>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>

              {formError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                  {formError}
                </div>
              ) : null}

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset
                  disabled={loading || oauthLoading}
                  aria-busy={loading || oauthLoading}
                  className="space-y-4"
                >
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

                <p className="pt-1 text-center text-sm text-muted-foreground">
                  Já tem conta?{" "}
                  <Link
                    href="/login"
                    className="text-foreground underline underline-offset-4"
                  >
                    Entrar
                  </Link>
                </p>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

