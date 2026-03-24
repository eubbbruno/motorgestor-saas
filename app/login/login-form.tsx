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
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type FormValues = z.infer<typeof Schema>;

// ─── Left-panel data ──────────────────────────────────────────────────────────

const benefits = [
  "Pipeline visual com Kanban — sem planilha",
  "WhatsApp integrado com histórico completo",
  "FIPE automática e propostas em PDF",
];

const testimonial = {
  quote:
    "Em 2 semanas, a equipe parou de perder lead no histórico. O funil deixou tudo previsível.",
  name: "Marina Almeida",
  role: "Gestora · Revenda Compacta",
};

// ─── Google icon ──────────────────────────────────────────────────────────────

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

// ─── Shared input className ───────────────────────────────────────────────────

const inputCls =
  "bg-[#0A1A0C] border-[rgba(74,229,74,0.2)] text-white placeholder:text-[#6B9E6B]/50 focus-visible:border-[#4AE54A] focus-visible:ring-[rgba(74,229,74,0.15)] rounded-xl h-11";

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm({ redirectTo = "/app" }: { redirectTo?: string }) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // ── Handlers (unchanged logic) ────────────────────────────────────────────

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setFormError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setFormError(getHumanErrorMessage(err) ?? "Tente novamente em instantes.");
      toast.error("Não foi possível entrar.", {
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#0D1F1A] p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(74,229,74,0.12),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 size-96 bg-[radial-gradient(circle,rgba(74,229,74,0.06),transparent_70%)]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#4AE54A] flex items-center justify-center">
            <CarIcon className="size-5 text-[#0D1F1A]" />
          </div>
          <div>
            <div className="font-bold text-white text-lg tracking-tight">MotorGestor</div>
            <div className="text-xs text-[#6B9E6B]">Gestão inteligente de revendas</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Organize sua revenda.
              <br />
              <span className="text-[#4AE54A]">Feche mais vendas.</span>
            </h2>
            <p className="text-[#6B9E6B] text-base">
              Pipeline, leads, agenda e FIPE em um só lugar. Sem planilha, sem bagunça.
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
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-2">
            <div className="size-8 rounded-xl bg-[#4AE54A] flex items-center justify-center">
              <CarIcon className="size-4 text-[#0D1F1A]" />
            </div>
            <span className="font-bold text-white text-base">MotorGestor</span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-1.5">Entrar na sua conta</h1>
            <p className="text-sm text-[#6B9E6B]">
              Acesse o MotorGestor e continue gerenciando seus leads e veículos.
            </p>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={onGoogle}
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] px-4 h-11 text-sm font-medium text-white hover:bg-[rgba(74,229,74,0.06)] hover:border-[rgba(74,229,74,0.35)] transition-colors disabled:opacity-50"
          >
            {oauthLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {oauthLoading ? "Redirecionando..." : "Continuar com Google"}
          </button>

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
              disabled={loading || oauthLoading}
              aria-busy={loading || oauthLoading}
              className="space-y-4"
            >
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
                  autoComplete="current-password"
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
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </fieldset>

            <p className="text-center text-sm text-[#6B9E6B]">
              Ainda não tem conta?{" "}
              <Link
                href="/cadastro"
                className="text-[#4AE54A] font-semibold hover:text-[#3dd13d] transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
