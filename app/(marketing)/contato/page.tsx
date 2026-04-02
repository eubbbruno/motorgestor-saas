"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MailIcon, MessageCircleIcon, ClockIcon, SendIcon } from "lucide-react";

import { Container } from "@/components/site/container";
import { FadeUp } from "@/components/site/fade-up";

const Schema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().optional(),
  subject: z.string().min(1, "Selecione um assunto."),
  message: z.string().min(10, "Conte um pouco mais para ajudarmos melhor."),
});

type FormValues = z.infer<typeof Schema>;

const inputClass =
  "w-full h-11 rounded-xl border border-[#4AE54A]/20 bg-[#0A1A0C] px-4 text-sm text-white placeholder:text-[#6B9E6B]/50 focus:outline-none focus:border-[#4AE54A]/60 transition-colors";

const labelClass = "block text-xs font-semibold text-[#6B9E6B] uppercase tracking-wider mb-2";

export default function ContatoPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const url = new URL(window.location.href);
      const body = {
        ...values,
        pagePath: url.pathname,
        utm_source: url.searchParams.get("utm_source") ?? undefined,
        utm_medium: url.searchParams.get("utm_medium") ?? undefined,
        utm_campaign: url.searchParams.get("utm_campaign") ?? undefined,
      };

      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Falha ao enviar.");

      toast.success("Mensagem enviada!", {
        description: "Em breve a gente retorna no seu e-mail/WhatsApp.",
      });
      form.reset();
    } catch {
      toast.error("Não foi possível enviar sua mensagem.", {
        description: "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0D1F1A] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(74,229,74,0.10),transparent)]" />
        <Container className="relative max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,229,74,0.3)] bg-[rgba(74,229,74,0.08)] px-4 py-1.5 text-sm font-semibold text-[#4AE54A] mb-6">
              Contato
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Fale com a{" "}
              <span className="text-[#4AE54A]">gente</span>
            </h1>
            <p className="text-[#6B9E6B] text-lg">
              Quer uma demo, tem dúvida de planos ou precisa de ajuda? Manda sua mensagem.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-24 bg-[#0A1A0C]">
        <Container className="max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-white mb-6">Enviar mensagem</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Nome</label>
                      <input
                        className={inputClass}
                        placeholder="Seu nome"
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>E-mail</label>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="voce@empresa.com"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>WhatsApp (opcional)</label>
                      <input
                        className={inputClass}
                        placeholder="(11) 99999-9999"
                        {...form.register("phone")}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Assunto</label>
                      <select
                        className={`${inputClass} cursor-pointer`}
                        {...form.register("subject")}
                      >
                        <option value="" className="bg-[#0F2014]">Selecione...</option>
                        <option value="demo" className="bg-[#0F2014]">Quero uma demo</option>
                        <option value="planos" className="bg-[#0F2014]">Dúvida sobre planos</option>
                        <option value="suporte" className="bg-[#0F2014]">Suporte técnico</option>
                        <option value="parceria" className="bg-[#0F2014]">Parceria</option>
                        <option value="outro" className="bg-[#0F2014]">Outro</option>
                      </select>
                      {form.formState.errors.subject && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mensagem</label>
                    <textarea
                      rows={5}
                      className="w-full rounded-xl border border-[#4AE54A]/20 bg-[#0A1A0C] px-4 py-3 text-sm text-white placeholder:text-[#6B9E6B]/50 focus:outline-none focus:border-[#4AE54A]/60 transition-colors resize-none"
                      placeholder="Conta rapidamente sua necessidade (ex: equipe, volume de leads, integrações)."
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-xs text-red-400 mt-1">{form.formState.errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#4AE54A] text-[#0D1F1A] font-bold text-sm hover:bg-[#3dd13d] transition-colors shadow-[0_0_20px_rgba(74,229,74,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <SendIcon className="size-4" />
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 lg:col-span-5">
              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center shrink-0">
                    <MailIcon className="size-4 text-[#4AE54A]" />
                  </div>
                  <div className="text-sm font-semibold text-white">E-mail</div>
                </div>
                <p className="text-sm text-[#6B9E6B]">contato@motorgestor.com.br</p>
              </div>

              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center shrink-0">
                    <MessageCircleIcon className="size-4 text-[#4AE54A]" />
                  </div>
                  <div className="text-sm font-semibold text-white">WhatsApp</div>
                </div>
                <p className="text-sm text-[#6B9E6B]">(11) 99999-9999</p>
                <p className="text-xs text-[#6B9E6B]/60 mt-1">Atendimento via chat para clientes Pro e Enterprise</p>
              </div>

              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-xl bg-[rgba(74,229,74,0.12)] flex items-center justify-center shrink-0">
                    <ClockIcon className="size-4 text-[#4AE54A]" />
                  </div>
                  <div className="text-sm font-semibold text-white">Horário de atendimento</div>
                </div>
                <div className="space-y-1 text-sm text-[#6B9E6B]">
                  <div className="flex justify-between">
                    <span>Segunda — Sexta</span>
                    <span className="text-white">9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="text-white">9h às 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="text-[#6B9E6B]/50">Fechado</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F2014] border border-[#4AE54A]/15 rounded-2xl p-6">
                <p className="text-xs text-[#6B9E6B] leading-relaxed">
                  Em geral respondemos em até{" "}
                  <span className="text-white font-semibold">1 dia útil</span>. Para urgências, clientes com plano Pro ou Enterprise têm suporte prioritário via chat.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
