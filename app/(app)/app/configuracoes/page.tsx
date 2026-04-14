"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Building2Icon,
  KeyIcon,
  Loader2Icon,
  PlusIcon,
  ShieldCheckIcon,
  ToggleLeftIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Informe seu nome.").optional(),
  phone: z.string().optional(),
});
type ProfileValues = z.infer<typeof ProfileSchema>;

const CompanySchema = z.object({
  name: z.string().min(2, "Informe o nome da empresa."),
  cnpj: z.string().optional(),
  address: z.string().optional(),
});
type CompanyValues = z.infer<typeof CompanySchema>;

const PasswordSchema = z
  .object({
    current: z.string().min(6, "Senha atual obrigatória."),
    newPwd: z.string().min(8, "Mínimo 8 caracteres."),
    confirm: z.string(),
  })
  .refine((d) => d.newPwd === d.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });
type PasswordValues = z.infer<typeof PasswordSchema>;

// ─── Integration data ─────────────────────────────────────────────────────────

const INTEGRATIONS = [
  { id: "webmotors", name: "Webmotors", color: "#E8003D", logo: "W" },
  { id: "olx", name: "OLX Autos", color: "#6E1FFF", logo: "OLX" },
  { id: "icarros", name: "iCarros", color: "#0070F3", logo: "iC" },
  { id: "whatsapp", name: "WhatsApp Business", color: "#25D366", logo: "WA", comingSoon: true },
] as const;

// ─── Tab: Perfil ──────────────────────────────────────────────────────────────

function PerfilTab() {
  const profile = useMyProfile();
  const update = useUpdateMyProfile();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { full_name: "", phone: "" },
  });

  React.useEffect(() => {
    if (profile.data) {
      form.reset({ full_name: profile.data.full_name ?? "" });
    }
  }, [profile.data, form]);

  async function onSubmit(values: ProfileValues) {
    try {
      await update.mutateAsync({ full_name: values.full_name ?? null });
      toast.success("Perfil salvo.");
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

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              title="Trocar foto de perfil (em breve)"
              className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#4AE54A] flex items-center justify-center text-[#0A1A0C] hover:bg-[#3dd43d] transition-colors"
            >
              <PlusIcon className="size-3" />
            </button>
          </div>
          <div>
            <div className="font-medium text-foreground">
              {profile.isLoading ? <Skeleton className="h-4 w-32" /> : (profile.data?.full_name ?? "—")}
            </div>
            <div className="text-sm text-muted-foreground">
              {profile.isLoading ? <Skeleton className="h-3 w-44 mt-1" /> : (profile.data?.email ?? "—")}
            </div>
            {profile.data?.role && (
              <Badge variant="secondary" className="mt-1 border bg-background/60 capitalize text-xs">
                <ShieldCheckIcon className="mr-1 size-3" />
                {profile.data.role}
              </Badge>
            )}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={busy} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input id="full_name" placeholder="Seu nome" {...form.register("full_name")} />
                {form.formState.errors.full_name && (
                  <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_ro">E-mail</Label>
                <Input
                  id="email_ro"
                  value={profile.data?.email ?? ""}
                  readOnly
                  disabled
                  className="opacity-60"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" {...form.register("phone")} />
              </div>
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar perfil"
              )}
            </Button>
          </fieldset>
        </form>
      </Card>
    </PremiumSurface>
  );
}

// ─── Tab: Empresa ─────────────────────────────────────────────────────────────

function EmpresaTab() {
  const profile = useMyProfile();
  const billing = useBillingSummary();

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

  const form = useForm<CompanyValues>({
    resolver: zodResolver(CompanySchema),
    defaultValues: { name: "", cnpj: "", address: "" },
  });

  React.useEffect(() => {
    if (company.data) {
      form.reset({ name: company.data.name ?? "" });
    }
  }, [company.data, form]);

  async function onSubmit() {
    toast.info("Atualização de empresa disponível em breve.");
  }

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2Icon className="size-4 text-muted-foreground" />
            <span className="font-medium">Dados da Empresa</span>
          </div>
          <Badge variant="secondary" className="border bg-background/60">
            {billing.isLoading ? "—" : billing.data?.plan?.name ?? "Free"}
          </Badge>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="co_name">Nome da empresa</Label>
              <Input id="co_name" placeholder="Ex: Autotech Veículos" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" placeholder="00.000.000/0001-00" {...form.register("cnpj")} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={company.data?.slug ?? ""} readOnly disabled className="opacity-60" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" placeholder="Rua, número, cidade" {...form.register("address")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logo da empresa</Label>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-[rgba(74,229,74,0.2)] bg-[rgba(74,229,74,0.03)] p-4 text-sm text-muted-foreground">
              <Building2Icon className="size-5 shrink-0" />
              Upload de logo — disponível em breve.
            </div>
          </div>

          <Button type="submit" variant="outline" className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
            Salvar empresa (em breve)
          </Button>
        </form>
      </Card>
    </PremiumSurface>
  );
}

// ─── Tab: Usuários ────────────────────────────────────────────────────────────

function UsuariosTab() {
  const profile = useMyProfile();

  const users = useQuery({
    queryKey: ["company_users", profile.data?.company_id],
    enabled: Boolean(profile.data?.company_id),
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("company_id", profile.data!.company_id as string)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as { id: string; full_name: string | null; email: string | null; role: string | null }[];
    },
  });

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">Usuários da Empresa</span>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info("Convite de usuário disponível em breve.")}
            className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d]"
          >
            <PlusIcon className="mr-1.5 size-3.5" />
            Convidar usuário
          </Button>
        </div>

        {users.isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : users.isError ? (
          <p className="text-sm text-red-300">Não foi possível carregar usuários.</p>
        ) : (users.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
        ) : (
          <div className="space-y-2">
            {(users.data ?? []).map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 rounded-xl border border-[rgba(74,229,74,0.1)] bg-[rgba(74,229,74,0.03)] px-4 py-3"
              >
                <Avatar>
                  <AvatarFallback>
                    {(u.full_name ?? u.email ?? "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.full_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email ?? "—"}</div>
                </div>
                {u.role && (
                  <Badge variant="secondary" className="border capitalize text-xs shrink-0">
                    {u.role}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </PremiumSurface>
  );
}

// ─── Tab: Integrações ─────────────────────────────────────────────────────────

function IntegracoesTab() {
  const [states, setStates] = React.useState<Record<string, boolean>>({});
  const [keys, setKeys] = React.useState<Record<string, string>>({});

  function toggle(id: string) {
    setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-4">
      {INTEGRATIONS.map((integ) => (
        <PremiumSurface key={integ.id}>
          <Card className="rounded-2xl border-0 bg-transparent p-5 shadow-none">
            <div className="flex items-start gap-4">
              <div
                className="size-10 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0"
                style={{
                  backgroundColor: integ.color + "22",
                  border: `1px solid ${integ.color}40`,
                  color: integ.color,
                }}
              >
                {integ.logo}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{integ.name}</span>
                  {"comingSoon" in integ && integ.comingSoon && (
                    <Badge className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[10px]">
                      Em breve
                    </Badge>
                  )}
                </div>

                {!("comingSoon" in integ && integ.comingSoon) && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(states[integ.id])}
                        onCheckedChange={() => toggle(integ.id)}
                        aria-label={`Ativar ${integ.name}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {states[integ.id] ? "Conectado" : "Desconectado"}
                      </span>
                    </div>
                    {states[integ.id] && (
                      <div className="space-y-1">
                        <Label className="text-xs" htmlFor={`key_${integ.id}`}>
                          API Key
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`key_${integ.id}`}
                            type="password"
                            placeholder="Insira sua API key"
                            value={keys[integ.id] ?? ""}
                            onChange={(e) =>
                              setKeys((prev) => ({ ...prev, [integ.id]: e.target.value }))
                            }
                            className="text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => toast.info("Salvo localmente (integração em breve).")}
                            className="shrink-0"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </PremiumSurface>
      ))}
    </div>
  );
}

// ─── Tab: Segurança ───────────────────────────────────────────────────────────

function SegurancaTab() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { current: "", newPwd: "", confirm: "" },
  });

  async function onSubmit() {
    toast.info("Troca de senha disponível em breve.");
    form.reset();
  }

  return (
    <div className="space-y-4">
      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <div className="flex items-center gap-2 mb-5">
            <KeyIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">Trocar senha</span>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="current">Senha atual</Label>
              <Input id="current" type="password" {...form.register("current")} />
              {form.formState.errors.current && (
                <p className="text-xs text-destructive">{form.formState.errors.current.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPwd">Nova senha</Label>
              <Input id="newPwd" type="password" {...form.register("newPwd")} />
              {form.formState.errors.newPwd && (
                <p className="text-xs text-destructive">{form.formState.errors.newPwd.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <Input id="confirm" type="password" {...form.register("confirm")} />
              {form.formState.errors.confirm && (
                <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
              )}
            </div>
            <Button type="submit">Trocar senha</Button>
          </form>
        </Card>
      </PremiumSurface>

      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">Sessões ativas</span>
          </div>
          <div className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[rgba(74,229,74,0.03)] px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Sessão atual</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Navegador · {new Date().toLocaleDateString("pt-BR")}
                </div>
              </div>
              <Badge className="bg-[#4AE54A]/10 text-[#4AE54A] border-[#4AE54A]/20">Ativa</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Gerenciamento avançado de sessões disponível em breve.
          </p>
        </Card>
      </PremiumSurface>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Conta"
        title="Configurações"
        description="Perfil, empresa, usuários e segurança."
      />

      <Tabs defaultValue="perfil" className="space-y-5">
        <TabsList className="bg-[#0F2014] border border-[rgba(74,229,74,0.1)] p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="perfil" className="gap-1.5 data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C]">
            <UserIcon className="size-3.5" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="empresa" className="gap-1.5 data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C]">
            <Building2Icon className="size-3.5" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-1.5 data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C]">
            <UsersIcon className="size-3.5" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="gap-1.5 data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C]">
            <ToggleLeftIcon className="size-3.5" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-1.5 data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C]">
            <ShieldCheckIcon className="size-3.5" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <PerfilTab />
        </TabsContent>

        <TabsContent value="empresa">
          <EmpresaTab />
        </TabsContent>

        <TabsContent value="usuarios">
          <UsuariosTab />
        </TabsContent>

        <TabsContent value="integracoes">
          <IntegracoesTab />
        </TabsContent>

        <TabsContent value="seguranca">
          <SegurancaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
