"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { CopyIcon, ExternalLinkIcon, Loader2Icon, PrinterIcon, SparklesIcon, TrashIcon } from "lucide-react";

import { useVehicle, useUpdateVehicle, useDeleteVehicle } from "@/features/vehicles/hooks";
import { useMyProfile } from "@/features/auth/hooks";
import { VehicleForm } from "@/features/vehicles/vehicle-form";
import type { VehicleFormValues } from "@/features/vehicles/schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { buildListingDescription, suggestListingTitle } from "@/lib/vehicle-listing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

async function copyText(text: string) {
  const value = (text ?? "").toString();
  if (!value) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // fallback
  }
  const el = document.createElement("textarea");
  el.value = value;
  el.setAttribute("readonly", "true");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export function VehicleDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const vehicle = useVehicle(id);
  const update = useUpdateVehicle();
  const del = useDeleteVehicle();
  const profile = useMyProfile();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [adOpen, setAdOpen] = React.useState(false);
  const [printLoading, setPrintLoading] = React.useState(false);
  const [adTitle, setAdTitle] = React.useState("");
  const [adCity, setAdCity] = React.useState("");
  const [adHighlights, setAdHighlights] = React.useState("");
  const [adDescription, setAdDescription] = React.useState("");
  const [adLoadingAi, setAdLoadingAi] = React.useState(false);
  const [photoUrls, setPhotoUrls] = React.useState<Record<string, string>>({});

  async function onSubmit(values: VehicleFormValues) {
    const v = await update.mutateAsync({ id, values });
    toast.success("Veículo atualizado.");
    router.push(`/app/veiculos/${v.id}`);
    router.refresh();
  }

  async function onDelete() {
    try {
      await del.mutateAsync(id);
      toast.success("Veículo removido.");
      router.push("/app/veiculos");
      router.refresh();
    } catch {
      toast.error("Não foi possível remover o veículo.");
    } finally {
      setConfirmOpen(false);
    }
  }

  const defaultValues: Partial<VehicleFormValues> | undefined = vehicle.data
    ? {
        title: vehicle.data.title,
        plate: vehicle.data.plate ?? "",
        chassis: vehicle.data.chassis ?? "",
        renavam: vehicle.data.renavam ?? "",
        make: vehicle.data.make ?? "",
        model: vehicle.data.model ?? "",
        version: vehicle.data.version ?? "",
        year: vehicle.data.year ?? undefined,
        price: vehicle.data.price ?? undefined,
        fipe_value: vehicle.data.fipe_value ?? undefined,
        fipe_reference: vehicle.data.fipe_reference ?? "",
        fipe_code: vehicle.data.fipe_code ?? "",
        description_ai: vehicle.data.description_ai ?? "",
        photo_paths: vehicle.data.photo_paths ?? [],
        mileage: vehicle.data.mileage ?? undefined,
        fuel: vehicle.data.fuel ?? "",
        transmission: vehicle.data.transmission ?? "",
        color: vehicle.data.color ?? "",
        status: vehicle.data.status,
        notes: vehicle.data.notes ?? "",
      }
    : undefined;

  const rawPhotoPaths = vehicle.data?.photo_paths;
  const photoPaths = React.useMemo(() => rawPhotoPaths ?? [], [rawPhotoPaths]);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!adOpen) return;
      if (!photoPaths.length) {
        if (!cancelled) setPhotoUrls({});
        return;
      }
      try {
        const supabase = createSupabaseBrowserClient();
        const entries = await Promise.all(
          photoPaths.map(async (p) => {
            const { data } = await supabase.storage.from("vehicle-photos").createSignedUrl(p, 60 * 60);
            return [p, data?.signedUrl ?? ""] as const;
          }),
        );
        if (!cancelled) setPhotoUrls(Object.fromEntries(entries.filter(([, url]) => Boolean(url))));
      } catch {
        if (!cancelled) setPhotoUrls({});
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [adOpen, photoPaths]);

  React.useEffect(() => {
    if (!adOpen) return;
    if (!vehicle.data) return;

    const v = vehicle.data;
    const suggested = suggestListingTitle({
      title: v.title,
      make: v.make,
      model: v.model,
      version: v.version ?? null,
      year: v.year,
      transmission: v.transmission,
    });

    const initialHighlights = [
      v.plate ? `Placa: ${v.plate}` : "",
      v.fipe_value != null ? "FIPE disponível" : "",
      v.description_ai ? "Descrição com IA disponível" : "",
    ]
      .filter(Boolean)
      .slice(0, 3)
      .join("\n");

    const desc = buildListingDescription({
      title: v.title,
      make: v.make,
      model: v.model,
      version: v.version ?? null,
      year: v.year,
      mileage: v.mileage,
      fuel: v.fuel,
      transmission: v.transmission,
      color: v.color,
      price: v.price,
      fipe_value: v.fipe_value ?? null,
      fipe_reference: v.fipe_reference ?? null,
      notes: (v.description_ai ?? v.notes) ?? null,
      city: "",
      highlights: initialHighlights,
    });

    setAdTitle(suggested || v.title);
    setAdCity("");
    setAdHighlights(initialHighlights);
    setAdDescription(desc);
  }, [adOpen, vehicle.data]);

  async function improveWithAi() {
    if (!vehicle.data) return;
    if (adLoadingAi) return;

    setAdLoadingAi(true);
    try {
      const v = vehicle.data;
      const price = v.price != null ? Number(v.price) : v.fipe_value != null ? Number(v.fipe_value) : null;
      const res = await fetch("/api/ai/vehicle-description", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: adTitle || v.title,
          make: v.make,
          model: v.model,
          year: v.year,
          price,
          mileage: v.mileage,
          fuel: v.fuel,
          transmission: v.transmission,
          color: v.color,
          notes: (adHighlights ? `Diferenciais:\n${adHighlights}\n\n` : "") + (v.notes ?? ""),
        }),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; description: string; provider: string }
        | { ok: false; error: string };
      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "IA indisponível.");
      }
      setAdDescription(body.description);
      toast.success("Descrição melhorada com IA.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "IA indisponível.";
      toast.error("Não foi possível melhorar a descrição.", { description: message });
    } finally {
      setAdLoadingAi(false);
    }
  }

  async function handlePrint() {
    if (!vehicle.data) return;
    setPrintLoading(true);
    try {
      // Garante que as signed URLs estão carregadas
      if (photoPaths.length && Object.keys(photoUrls).length === 0) {
        const supabase = createSupabaseBrowserClient();
        const entries = await Promise.all(
          photoPaths.map(async (p) => {
            const { data } = await supabase.storage.from("vehicle-photos").createSignedUrl(p, 60 * 60);
            return [p, data?.signedUrl ?? ""] as const;
          }),
        );
        setPhotoUrls(Object.fromEntries(entries.filter(([, url]) => Boolean(url))));
      }
    } catch {
      // não bloqueia o print se falhar
    } finally {
      setPrintLoading(false);
    }
    window.print();
  }

  const v = vehicle.data;
  const printPhotoUrl = v ? (photoUrls[photoPaths[0] ?? ""] ?? null) : null;
  const companyName = profile.data?.full_name ?? "Concessionária";

  return (
    <div className="space-y-6">
      {/* ── Print / PDF layout (invisível na tela, visível na impressão) ── */}
      {v && (
        <div id="mg-vehicle-pdf" style={{ display: "none" }}>
          <div className="pdf-header">
            <span className="pdf-logo">MotorGestor</span>
            <span className="pdf-company">{companyName}</span>
          </div>

          <h1>{v.title}</h1>
          <h2>
            {[v.make, v.model, v.version].filter(Boolean).join(" ")}
            {v.year ? ` · ${v.year}` : ""}
          </h2>

          {printPhotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={printPhotoUrl} alt={v.title} className="pdf-photo" />
          )}

          {v.price != null && (
            <div className="pdf-price">
              R$ {Number(v.price).toLocaleString("pt-BR")}
            </div>
          )}

          <div className="pdf-grid">
            {[
              { label: "Marca", value: v.make },
              { label: "Modelo", value: v.model },
              { label: "Versão", value: v.version },
              { label: "Ano", value: v.year },
              { label: "Cor", value: v.color },
              { label: "Quilometragem", value: v.mileage != null ? `${Number(v.mileage).toLocaleString("pt-BR")} km` : null },
              { label: "Combustível", value: v.fuel },
              { label: "Câmbio", value: v.transmission },
              { label: "Portas", value: "4" },
              { label: "Placa", value: v.plate },
              { label: "Chassi", value: v.chassis },
              { label: "RENAVAM", value: v.renavam },
            ]
              .filter(({ value }) => value != null && String(value).trim() !== "")
              .map(({ label, value }) => (
                <div key={label} className="pdf-grid-item">
                  <label>{label}</label>
                  <span>{String(value)}</span>
                </div>
              ))}
          </div>

          {(v.description_ai || v.notes) && (
            <>
              <div className="pdf-section-title">Descrição</div>
              <div className="pdf-description">{v.description_ai ?? v.notes}</div>
            </>
          )}

          <div className="pdf-footer">
            <span>Gerado pelo MotorGestor</span>
            <span>motorgestor.com.br</span>
            <span>{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      )}

      <PageHeader
        kicker="Estoque"
        title={vehicle.data?.title ? `Veículo · ${vehicle.data.title}` : "Veículo"}
        description="Edite as informações e mantenha o status do estoque atualizado."
        right={
          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:items-center">
            <Button asChild variant="outline" className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2">
              <Link href="/app/veiculos">Voltar</Link>
            </Button>
            <Button
              variant="outline"
              className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
              onClick={() => setAdOpen(true)}
              disabled={!vehicle.data}
            >
              Gerar anúncio
            </Button>
            <Button
              variant="outline"
              className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
              onClick={handlePrint}
              disabled={printLoading || !vehicle.data}
            >
              {printLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <PrinterIcon className="mr-2 size-4" />
              )}
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              className="border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
              disabled={!vehicle.data}
              onClick={() => {
                if (!vehicle.data) return;
                const v = vehicle.data;
                const text = [
                  `*${v.title}*`,
                  v.year ? `Ano: ${v.year}` : "",
                  v.mileage != null ? `KM: ${Number(v.mileage).toLocaleString("pt-BR")}` : "",
                  v.color ? `Cor: ${v.color}` : "",
                  v.fuel ? `Combustível: ${v.fuel}` : "",
                  v.price != null ? `Preço: R$ ${Number(v.price).toLocaleString("pt-BR")}` : "",
                  "",
                  "Mais informações: motorgestor.com.br",
                ]
                  .filter(Boolean)
                  .join("\n");
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
              }}
            >
              Compartilhar WhatsApp
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <TrashIcon className="mr-2 size-4" />
              Remover
            </Button>
          </div>
        }
      />

      {vehicle.isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando...</div>
      ) : vehicle.isError ? (
        <div className="text-sm text-destructive">
          Não foi possível carregar o veículo.
        </div>
      ) : vehicle.data ? (
        <VehicleForm
          title="Detalhes do veículo"
          submitLabel="Salvar alterações"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          companyId={vehicle.data.company_id}
          loading={update.isPending}
        />
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover veículo</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O veículo será removido do seu estoque.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={del.isPending}>
              {del.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adOpen} onOpenChange={setAdOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gerador de anúncio (OLX / Webmotors)</DialogTitle>
            <DialogDescription>
              Gere um anúncio pronto para copiar e publicar. Ajuste o texto conforme necessário.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="space-y-2">
                <Label htmlFor="ad-title">Título sugerido</Label>
                <Input
                  id="ad-title"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Título do anúncio"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ad-city">Cidade</Label>
                  <Input
                    id="ad-city"
                    value={adCity}
                    onChange={(e) => setAdCity(e.target.value)}
                    placeholder="Ex: Londrina/PR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-highlights">Diferenciais (1 por linha)</Label>
                  <Textarea
                    id="ad-highlights"
                    rows={4}
                    value={adHighlights}
                    onChange={(e) => setAdHighlights(e.target.value)}
                    placeholder="Ex:\nRevisões em dia\nManual + chave reserva\nPneus novos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Label htmlFor="ad-desc">Descrição completa</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!vehicle.data) return;
                      const v = vehicle.data;
                      setAdDescription(
                        buildListingDescription({
                          title: adTitle || v.title,
                          make: v.make,
                          model: v.model,
                          version: v.version ?? null,
                          year: v.year,
                          mileage: v.mileage,
                          fuel: v.fuel,
                          transmission: v.transmission,
                          color: v.color,
                          price: v.price,
                          fipe_value: v.fipe_value ?? null,
                          fipe_reference: v.fipe_reference ?? null,
                          notes: (v.description_ai ?? v.notes) ?? null,
                          city: adCity,
                          highlights: adHighlights,
                        }),
                      );
                      toast.success("Descrição atualizada.");
                    }}
                  >
                    Regerar
                  </Button>
                </div>
                <Textarea
                  id="ad-desc"
                  rows={12}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="Descrição do anúncio"
                />
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <PremiumSurface>
                <Card className="rounded-2xl border-0 bg-transparent p-4 shadow-none">
                <div className="text-sm font-medium">Ações</div>
                <div className="mt-3 grid gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      void copyText(`${adTitle}\n\n${adDescription}`)
                        .then(() => toast.success("Anúncio copiado."))
                        .catch(() => toast.error("Não foi possível copiar."))
                    }
                    disabled={!adTitle && !adDescription}
                  >
                    <CopyIcon className="mr-2 size-4" />
                    Copiar anúncio
                  </Button>

                  <Button asChild type="button" variant="outline">
                    <a href="https://www.olx.com.br/anunciar" target="_blank" rel="noreferrer">
                      <ExternalLinkIcon className="mr-2 size-4" />
                      Abrir OLX
                    </a>
                  </Button>

                  <Button asChild type="button" variant="outline">
                    <a href="https://www.webmotors.com.br/sell" target="_blank" rel="noreferrer">
                      <ExternalLinkIcon className="mr-2 size-4" />
                      Abrir Webmotors
                    </a>
                  </Button>

                  <Button type="button" onClick={improveWithAi} disabled={adLoadingAi}>
                    {adLoadingAi ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Melhorando...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="mr-2 size-4" />
                        Melhorar descrição com IA
                      </>
                    )}
                  </Button>
                </div>
                </Card>
              </PremiumSurface>

              <PremiumSurface>
                <Card className="rounded-2xl border-0 bg-transparent p-4 shadow-none">
                <div className="text-sm font-medium">Fotos do veículo</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {photoPaths.length ? (
                    photoPaths.slice(0, 8).map((p) => {
                      const url = photoUrls[p];
                      return (
                        <div key={p} className="overflow-hidden rounded-lg border bg-background/60">
                          {url ? (
                            // Signed URLs podem variar por ambiente; `next/image` exigiria configurar host remoto.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt="Foto do veículo" className="h-24 w-full object-cover" />
                          ) : (
                            <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
                              Carregando...
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-sm text-muted-foreground">
                      Nenhuma foto cadastrada ainda.
                    </div>
                  )}
                </div>
                {photoPaths.length > 8 ? (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Mostrando 8 de {photoPaths.length} fotos.
                  </div>
                ) : null}
                </Card>
              </PremiumSurface>
            </div>
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
}

