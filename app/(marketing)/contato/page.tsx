"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Schema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Conte um pouco mais para ajudarmos melhor."),
});

type FormValues = z.infer<typeof Schema>;

export default function ContatoPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "", company: "", phone: "", message: "" },
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
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale com a gente"
        subtitle="Quer uma demo, tem dúvida de planos ou precisa de ajuda com a implantação? Manda sua mensagem."
      />

      <section className="pb-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="bg-background/60 p-6 lg:col-span-7">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome" {...form.register("name")} />
                    {form.formState.errors.name ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="voce@empresa.com"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa (opcional)</Label>
                    <Input id="company" placeholder="Revenda X" {...form.register("company")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp (opcional)</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" {...form.register("phone")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Conte rapidamente sua necessidade (ex: equipe, volume de leads, integrações)."
                    {...form.register("message")}
                  />
                  {form.formState.errors.message ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4 lg:col-span-5">
              <Card className="bg-background/60 p-6">
                <div className="text-sm font-medium">Respostas rápidas</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Em geral respondemos em até 1 dia útil. Para urgências, use o
                  canal de suporte.
                </p>
              </Card>
              <Card className="bg-background/60 p-6">
                <div className="text-sm font-medium">Suporte</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Veja guias e perguntas frequentes em{" "}
                  <a className="underline underline-offset-4" href="/suporte">
                    /suporte
                  </a>
                  .
                </p>
              </Card>
              <Card className="bg-background/60 p-6">
                <div className="text-sm font-medium">Segurança</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Multi-tenant com RLS e boas práticas. Leia{" "}
                  <a className="underline underline-offset-4" href="/seguranca">
                    /seguranca
                  </a>
                  .
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

