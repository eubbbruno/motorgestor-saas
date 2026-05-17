"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CarIcon, CheckIcon, Loader2Icon, StarIcon } from "lucide-react";

import { getHumanErrorMessage } from "@/lib/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Schema (unchanged) ───────────────────────────────────────────────────────

const Schema = z.object({
  fullName: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type FormValues = z.infer<typeof Schema>;

// ─── Left-panel data ──────────────────────────────────────────────────────────

const benefits = [
  "Setup completo em menos de 20 minutos",
  "Plano Free sem cartão de crédito",
  "Pipeline, FIPE e WhatsApp prontos para usar",
];

const testimonial = {
  quote:
    "As métricas do dashboard viraram rotina. É o tipo de visibilidade que antes só existia em planilha gigante.",
  name: "Diego Pereira",
  role: "Sócio · Loja de Seminovos",
};

// ─── OAuth icons ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.35c-.7 3.25-4.15 4.95-7.2 3.45a6.04 6.04 0 0 1-3.3-3.55 6.05 6.05 0 0 1 1.4-6.1 6.2 6.2 0 0 1 8.55-.2l2-2A8.94 8.94 0 0 0 3.1 9.7a9.01 9.01 0 0 0 4.85 12.7c4.85 2.55 11.8.1 13.25-6.2.15-.7.15-1.45.15-2.2 0-.6-.05-1.25-.1-1.9Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12.07h2.54V9.79c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.46h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.773l-.443 2.89h-2.33v6.988C20.343 21.2 24 17.062 24 12.073z" />
    </svg>
  );
}

// ─── Shared input className ───────────────────────────────────────────────────

const inputCls =
  "bg-[#0A1A0C] border-[rgba(74,229,74,0.2)] text-white placeholder:text-[#6B9E6B]/50 focus-visible:border-[#4AE54A] focus-visible:ring-[rgba(74,229,74,0.15)] rounded-xl h-11";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState(false);
  const [fbLoading, setFbLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // ── Handlers (unchanged logic) ────────────────────────────────────────────

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

  async function onFacebook() {
    setFbLoading(true);
    setFormError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: `${siteUrl}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setFormError(getHumanErrorMessage(err) ?? "Tente novamente em instantes.");
      toast.error("Não foi possível continuar com Facebook.", {
        description: getHumanErrorMessage(err) ?? "Tente novamente em instantes.",
      });
      setFbLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#0D1F1A] p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(74,229,74,0.12),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 size-96 bg-[radial-gradient(circle,rgba(74,229,74,0.06),transparent_70%)]" />

        {/* Logo */}
        <div className="relative">
          <img src="/images/logo-motorgestor.png" alt="MotorGestor" className="h-12 w-auto" />
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Comece grátis hoje.
              <br />
              <span className="text-[#4AE54A]">Sem cartão de crédito.</span>
            </h2>
            <p className="text-[#6B9E6B] text-base">
              Configure em minutos e veja a diferença na sua operação a partir do primeiro dia.
            </p>
          </div>

          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="size-5 rounded-full bg-[rgba(74,229,74,0.15)] border border-[rgba(74,229,74,0.3)] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon className="size-3 text-[#4AE54A]" />
                </div>
                <span className="text-sm text-[#9CA3AF]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-2xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] p-5">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="size-3.5 text-[#4AE54A] fill-[#4AE54A]" />
            ))}
          </div>
          <p className="text-sm text-[#9CA3AF] leading-relaxed mb-3">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="text-xs font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-[#6B9E6B]">{testimonial.role}</div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center bg-[#111F16] px-6 py-12 lg:px-12">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-2">
            <img src="/images/logo-motorgestor.png" alt="MotorGestor" className="h-12 w-auto" />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-1.5">Criar sua conta</h1>
            <p className="text-sm text-[#6B9E6B]">
              Crie sua conta e comece a organizar estoque, leads e agenda em minutos.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onGoogle}
              disabled={loading || oauthLoading || fbLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] px-4 h-11 text-sm font-medium text-white hover:bg-[rgba(74,229,74,0.06)] hover:border-[rgba(74,229,74,0.35)] transition-colors disabled:opacity-50"
            >
              {oauthLoading ? <Loader2Icon className="size-4 animate-spin" /> : <GoogleIcon />}
              {oauthLoading ? "Redirecionando..." : "Continuar com Google"}
            </button>

            <button
              type="button"
              onClick={onFacebook}
              disabled={loading || oauthLoading || fbLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] px-4 h-11 text-sm font-medium text-white hover:bg-[rgba(74,229,74,0.06)] hover:border-[rgba(74,229,74,0.35)] transition-colors disabled:opacity-50"
            >
              {fbLoading ? <Loader2Icon className="size-4 animate-spin" /> : <FacebookIcon />}
              {fbLoading ? "Redirecionando..." : "Continuar com Facebook"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[rgba(74,229,74,0.08)]" />
            <span className="text-xs text-[#6B9E6B]">ou</span>
            <div className="flex-1 h-px bg-[rgba(74,229,74,0.08)]" />
          </div>

          {/* Form error */}
          {formError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-2.5 text-sm text-red-400"
            >
              {formError}
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <fieldset
              disabled={loading || oauthLoading || fbLoading}
              aria-busy={loading || oauthLoading || fbLoading}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[#6B9E6B] text-xs font-medium">
                  Nome completo
                </Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome"
                  autoComplete="name"
                  aria-invalid={Boolean(form.formState.errors.fullName)}
                  aria-describedby={
                    form.formState.errors.fullName ? "fullName-error" : undefined
                  }
                  className={inputCls}
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName ? (
                  <p id="fullName-error" className="text-xs text-red-400" role="alert">
                    {form.formState.errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#6B9E6B] text-xs font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  aria-describedby={
                    form.formState.errors.email ? "email-error" : undefined
                  }
                  className={inputCls}
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p id="email-error" className="text-xs text-red-400" role="alert">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#6B9E6B] text-xs font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  aria-describedby={
                    form.formState.errors.password ? "password-error" : undefined
                  }
                  className={inputCls}
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p id="password-error" className="text-xs text-red-400" role="alert">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-semibold text-sm shadow-[0_0_20px_rgba(74,229,74,0.25)] transition-all hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar conta grátis"
                )}
              </Button>
            </fieldset>

            <p className="text-center text-sm text-[#6B9E6B]">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="text-[#4AE54A] font-semibold hover:text-[#3dd13d] transition-colors"
              >
                Entrar
              </Link>
            </p>
          </form>

          <p className="text-center text-xs text-[#6B9E6B]/60">
            Ao criar sua conta, você concorda com os{" "}
            <Link href="/termos-de-uso" className="underline hover:text-[#6B9E6B]">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/politica-de-privacidade" className="underline hover:text-[#6B9E6B]">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
