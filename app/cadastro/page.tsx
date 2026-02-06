"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
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
        description: getErrorMessage(err) ?? "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece em minutos com estoque, leads e agenda prontos para operar.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome</Label>
            <Input id="fullName" placeholder="Seu nome" {...form.register("fullName")} />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-destructive">
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
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">
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
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>

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

