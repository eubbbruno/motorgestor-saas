"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { VehicleFormSchema, type VehicleFormValues } from "@/features/vehicles/schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PremiumSurface } from "@/components/dashboard/premium-surface";

type FipeOption = { code: string; name: string };
type FipeYearOption = { code: string; name: string; year: number };

const statusLabels: Record<VehicleFormValues["status"], string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  inativo: "Inativo",
};

export function VehicleForm({
  title,
  submitLabel,
  defaultValues,
  onSubmit,
  companyId,
  loading,
}: {
  title: string;
  submitLabel: string;
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<void> | void;
  companyId?: string | null;
  loading?: boolean;
}) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(VehicleFormSchema),
    defaultValues: {
      title: "",
      plate: "",
      chassis: "",
      renavam: "",
      make: "",
      model: "",
      version: "",
      year: undefined,
      price: undefined,
      fipe_value: undefined,
      fipe_reference: "",
      fipe_code: "",
      description_ai: "",
      photo_paths: [],
      mileage: undefined,
      fuel: "",
      transmission: "",
      color: "",
      status: "disponivel",
      notes: "",
      ...defaultValues,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [fipeLoading, setFipeLoading] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);

  const [brandsLoading, setBrandsLoading] = React.useState(false);
  const [modelsLoading, setModelsLoading] = React.useState(false);
  const [yearsLoading, setYearsLoading] = React.useState(false);

  const [brands, setBrands] = React.useState<FipeOption[]>([]);
  const [models, setModels] = React.useState<FipeOption[]>([]);
  const [years, setYears] = React.useState<FipeYearOption[]>([]);

  const [brandCode, setBrandCode] = React.useState<string>("");
  const [modelCode, setModelCode] = React.useState<string>("");
  const [yearCode, setYearCode] = React.useState<string>("");
  const fipeOptionsAvailable = brandsLoading || brands.length > 0;

  async function handleSubmit(values: VehicleFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  const busy = Boolean(loading || submitting);
  const busyFipe = Boolean(busy || fipeLoading);
  const busyAi = Boolean(busy || aiLoading);

  const [uploading, setUploading] = React.useState(false);
  const [photoUrls, setPhotoUrls] = React.useState<Record<string, string>>({});
  const photoPaths = form.watch("photo_paths") ?? [];
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function sanitizeFilename(name: string) {
    return name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .slice(0, 120);
  }

  async function refreshSignedUrls(paths: string[]) {
    if (!paths.length) {
      setPhotoUrls({});
      return;
    }
    try {
      const supabase = createSupabaseBrowserClient();
      const entries = await Promise.all(
        paths.map(async (p) => {
          const { data } = await supabase
            .storage
            .from("vehicle-photos")
            .createSignedUrl(p, 60 * 60);
          return [p, data?.signedUrl ?? ""] as const;
        }),
      );
      const next = Object.fromEntries(entries.filter(([, url]) => Boolean(url)));
      setPhotoUrls(next);
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    void refreshSignedUrls(photoPaths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPaths.join("|")]);

  async function onUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!companyId) {
      toast.error("Empresa não identificada. Finalize o onboarding antes de enviar fotos.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const safeName = sanitizeFilename(file.name || "foto.jpg");
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now());
        const path = `${companyId}/${id}-${safeName}`;
        const { error } = await supabase.storage.from("vehicle-photos").upload(path, file, {
          upsert: false,
          contentType: file.type || undefined,
        });
        if (error) throw error;
        uploaded.push(path);
      }

      const next = [...photoPaths, ...uploaded];
      form.setValue("photo_paths", next, { shouldDirty: true, shouldValidate: true });
      toast.success("Fotos enviadas.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Não foi possível enviar as fotos.";
      toast.error("Upload falhou.", { description: message });
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(path: string) {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.storage.from("vehicle-photos").remove([path]);
    } catch {
      // não bloqueia remoção no form
    } finally {
      const next = (form.getValues("photo_paths") ?? []).filter((p) => p !== path);
      form.setValue("photo_paths", next, { shouldDirty: true, shouldValidate: true });
      setPhotoUrls((prev) => {
        const cp = { ...prev };
        delete cp[path];
        return cp;
      });
    }
  }

  async function fetchFipeOptions(params?: { brandCode?: string; modelCode?: string }) {
    const sp = new URLSearchParams();
    if (params?.brandCode) sp.set("brandCode", params.brandCode);
    if (params?.modelCode) sp.set("modelCode", params.modelCode);
    const res = await fetch(`/api/fipe/options?${sp.toString()}`, { method: "GET" });
    const body = (await res.json().catch(() => null)) as
      | { ok: true; data: unknown }
      | { ok: false; error: string };
    if (!res.ok || !body || body.ok === false) {
      throw new Error(body && "error" in body ? body.error : "FIPE indisponível.");
    }
    return body.data as unknown;
  }

  // Carrega marcas (1x)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBrandsLoading(true);
      try {
        const data = (await fetchFipeOptions()) as Array<{ code: string; name: string }>;
        if (!cancelled) setBrands(data ?? []);
      } catch {
        if (!cancelled) setBrands([]);
      } finally {
        if (!cancelled) setBrandsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Quando brand muda, carrega modelos
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!brandCode) {
        setModels([]);
        setYears([]);
        return;
      }
      setModelsLoading(true);
      try {
        const data = (await fetchFipeOptions({ brandCode })) as Array<{ code: string; name: string }>;
        if (!cancelled) setModels(data ?? []);
      } catch {
        if (!cancelled) setModels([]);
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brandCode]);

  // Quando model muda, carrega anos
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!brandCode || !modelCode) {
        setYears([]);
        return;
      }
      setYearsLoading(true);
      try {
        const data = (await fetchFipeOptions({
          brandCode,
          modelCode,
        })) as Array<{ code: string; name: string; year: number }>;
        if (!cancelled) setYears((data ?? []).filter((y) => Number.isFinite(y.year)));
      } catch {
        if (!cancelled) setYears([]);
      } finally {
        if (!cancelled) setYearsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brandCode, modelCode]);

  // Tenta pré-selecionar (edição) via nomes existentes
  React.useEffect(() => {
    if (!brands.length) return;
    if (brandCode) return;
    const currentMake = (form.getValues("make") ?? "").trim().toLowerCase();
    if (!currentMake) return;
    const found = brands.find((b) => b.name.toLowerCase() === currentMake) ?? null;
    if (found) setBrandCode(found.code);
  }, [brands, brandCode, form]);

  React.useEffect(() => {
    if (!models.length) return;
    if (modelCode) return;
    const currentModel = (form.getValues("model") ?? "").trim().toLowerCase();
    if (!currentModel) return;
    const found = models.find((m) => m.name.toLowerCase() === currentModel) ?? null;
    if (found) setModelCode(found.code);
  }, [models, modelCode, form]);

  React.useEffect(() => {
    if (!years.length) return;
    if (yearCode) return;
    const currentYear = form.getValues("year");
    if (!currentYear) return;
    const found = years.find((y) => y.year === currentYear) ?? null;
    if (found) setYearCode(found.code);
  }, [years, yearCode, form]);

  async function fetchFipe() {
    if (busyFipe) return;

    const make = (form.getValues("make") ?? "").trim();
    const model = (form.getValues("model") ?? "").trim();
    const year = form.getValues("year");

    if ((!make || !model || !year) && !(brandCode && modelCode && yearCode)) {
      toast.error("Para buscar FIPE, selecione Marca, Modelo e Ano.");
      return;
    }

    setFipeLoading(true);
    try {
      const res = await fetch("/api/fipe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          brandCode && modelCode && yearCode
            ? { brandCode, modelCode, yearCode }
            : { make, model, year },
        ),
      });

      const body = (await res.json().catch(() => null)) as
        | { ok: true; value: number; reference: string; fipeCode?: string }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "FIPE indisponível.");
      }

      form.setValue("fipe_value", body.value, { shouldDirty: true, shouldValidate: true });
      form.setValue("fipe_reference", body.reference, { shouldDirty: true });
      form.setValue("fipe_code", body.fipeCode ?? "", { shouldDirty: true });

      toast.success("Valor FIPE atualizado.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "FIPE indisponível.";
      toast.error("Não foi possível buscar a FIPE.", {
        description: message,
      });
    } finally {
      setFipeLoading(false);
    }
  }

  async function lookupVehicle() {
    if (busy) return;

    const plate = (form.getValues("plate") ?? "").trim();
    const chassis = (form.getValues("chassis") ?? "").trim();
    const renavam = (form.getValues("renavam") ?? "").trim();

    if (!plate && !chassis && !renavam) {
      toast.error("Informe placa, chassi ou renavam para buscar.");
      return;
    }

    setFipeLoading(true);
    try {
      const res = await fetch("/api/vehicle-lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plate, chassis, renavam }),
      });

      const body = (await res.json().catch(() => null)) as
        | {
            ok: true;
            make?: string | null;
            model?: string | null;
            year?: number | null;
            version?: string | null;
            fuel?: string | null;
          }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "Busca indisponível.");
      }

      if (body.make) form.setValue("make", body.make, { shouldDirty: true, shouldValidate: true });
      if (body.model) form.setValue("model", body.model, { shouldDirty: true, shouldValidate: true });
      if (body.year) form.setValue("year", body.year, { shouldDirty: true, shouldValidate: true });
      if (body.version) form.setValue("version", body.version, { shouldDirty: true, shouldValidate: true });
      if (body.fuel) form.setValue("fuel", body.fuel, { shouldDirty: true, shouldValidate: true });

      // Re-tenta casar selects FIPE com os valores preenchidos
      setBrandCode("");
      setModelCode("");
      setYearCode("");

      toast.success("Dados do veículo preenchidos.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Busca indisponível.";
      toast.error("Não foi possível buscar os dados do veículo.", { description: message });
    } finally {
      setFipeLoading(false);
    }
  }

  async function generateDescriptionAi() {
    if (busyAi) return;

    const title = (form.getValues("title") ?? "").trim();
    if (!title) {
      toast.error("Informe pelo menos o título do veículo para gerar a descrição.");
      return;
    }

    setAiLoading(true);
    try {
      const payload = {
        title,
        make: (form.getValues("make") ?? "").trim() || null,
        model: (form.getValues("model") ?? "").trim() || null,
        year: form.getValues("year") ?? null,
        price: form.getValues("price") ?? null,
        mileage: form.getValues("mileage") ?? null,
        fuel: (form.getValues("fuel") ?? "").trim() || null,
        transmission: (form.getValues("transmission") ?? "").trim() || null,
        color: (form.getValues("color") ?? "").trim() || null,
        notes: (form.getValues("notes") ?? "").trim() || null,
      };

      const res = await fetch("/api/ai/vehicle-description", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await res.json().catch(() => null)) as
        | { ok: true; description: string }
        | { ok: false; error: string };

      if (!res.ok || !body || body.ok === false) {
        throw new Error(body && "error" in body ? body.error : "IA indisponível.");
      }

      form.setValue("description_ai", body.description, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success("Descrição gerada com IA.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "IA indisponível.";
      toast.error("Não foi possível gerar a descrição.", { description: message });
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <PremiumSurface>
      <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-base font-medium text-foreground">{title}</div>
        <div className="text-xs text-mg-fg-muted">
          Dica: use a seleção FIPE para padronizar marca/modelo/ano.
        </div>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
        <fieldset disabled={busy} aria-busy={busy} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Corolla XEi 2.0 AT 2020"
                aria-invalid={Boolean(form.formState.errors.title)}
                aria-describedby={form.formState.errors.title ? "title-error" : undefined}
                className={form.formState.errors.title ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p id="title-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">Placa</Label>
              <Input id="plate" placeholder="ABC1D23" {...form.register("plate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chassis">Chassi</Label>
              <Input id="chassis" placeholder="9BW..." {...form.register("chassis")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renavam">Renavam</Label>
              <Input id="renavam" placeholder="00000000000" {...form.register("renavam")} />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
                onClick={lookupVehicle}
                disabled={busyFipe}
              >
                {busyFipe ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  "Buscar dados do veículo"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                A busca por placa/chassi/renavam pode exigir provedor externo (configurável).
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Fotos do veículo</div>
                  <div className="text-xs text-muted-foreground">
                    Envie fotos reais (Supabase Storage). Você pode remover depois.
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy || uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 size-4" />
                      Upload
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    void onUploadFiles(e.currentTarget.files);
                    e.currentTarget.value = "";
                  }}
                />
              </div>

              {photoPaths.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {photoPaths.map((p) => {
                    const url = photoUrls[p];
                    return (
                      <div key={p} className="group relative overflow-hidden rounded-lg border bg-background/60">
                        {url ? (
                          <img src={url} alt="Foto do veículo" className="h-40 w-full object-cover" />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
                            Carregando...
                          </div>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100"
                          onClick={() => void removePhoto(p)}
                          aria-label="Remover foto"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Nenhuma foto enviada ainda.</div>
              )}
            </div>

            {fipeOptionsAvailable ? (
              <>
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Select
                    value={brandCode}
                    onValueChange={(v) => {
                      setBrandCode(v);
                      setModelCode("");
                      setYearCode("");
                      const picked = brands.find((b) => b.code === v);
                      form.setValue("make", picked?.name ?? "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("model", "", { shouldDirty: true, shouldValidate: true });
                      form.setValue("year", undefined, { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={brandsLoading ? "Carregando..." : "Selecione a marca"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(brands ?? []).map((b) => (
                        <SelectItem key={b.code} value={b.code}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select
                    value={modelCode}
                    onValueChange={(v) => {
                      setModelCode(v);
                      setYearCode("");
                      const picked = models.find((m) => m.code === v);
                      form.setValue("model", picked?.name ?? "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("year", undefined, { shouldDirty: true, shouldValidate: true });
                    }}
                    disabled={!brandCode || modelsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !brandCode
                            ? "Selecione a marca primeiro"
                            : modelsLoading
                              ? "Carregando..."
                              : "Selecione o modelo"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(models ?? []).map((m) => (
                        <SelectItem key={m.code} value={m.code}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ano</Label>
                  <Select
                    value={yearCode}
                    onValueChange={(v) => {
                      setYearCode(v);
                      const picked = years.find((y) => y.code === v) ?? null;
                      form.setValue("year", picked?.year ?? undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    disabled={!brandCode || !modelCode || yearsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !brandCode || !modelCode
                            ? "Selecione marca e modelo"
                            : yearsLoading
                              ? "Carregando..."
                              : "Selecione o ano"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(years ?? []).map((y) => (
                        <SelectItem key={y.code} value={y.code}>
                          {y.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.year ? (
                    <p id="year-error" className="text-xs text-destructive" role="alert">
                      {form.formState.errors.year.message}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="make">Marca</Label>
                  <Input id="make" placeholder="Toyota" {...form.register("make")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Corolla" {...form.register("model")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    inputMode="numeric"
                    placeholder="2020"
                    aria-invalid={Boolean(form.formState.errors.year)}
                    aria-describedby={form.formState.errors.year ? "year-error" : undefined}
                    className={
                      form.formState.errors.year
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : undefined
                    }
                    {...form.register("year", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                  {form.formState.errors.year ? (
                    <p id="year-error" className="text-xs text-destructive" role="alert">
                      {form.formState.errors.year.message}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    FIPE indisponível para seleção em cascata. Você ainda pode preencher manualmente.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="version">Versão (opcional)</Label>
              <Input
                id="version"
                placeholder="Ex: XEi 2.0 AT"
                {...form.register("version")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">KM</Label>
              <Input
                id="mileage"
                type="number"
                inputMode="numeric"
                placeholder="45000"
                aria-invalid={Boolean(form.formState.errors.mileage)}
                aria-describedby={form.formState.errors.mileage ? "mileage-error" : undefined}
                className={form.formState.errors.mileage ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("mileage", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.mileage ? (
                <p id="mileage-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.mileage.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="129900"
                aria-invalid={Boolean(form.formState.errors.price)}
                aria-describedby={form.formState.errors.price ? "price-error" : undefined}
                className={form.formState.errors.price ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("price", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.price ? (
                <p id="price-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.price.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fipe_value">Valor FIPE (opcional)</Label>
              <Input
                id="fipe_value"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Ex: 125000"
                aria-invalid={Boolean(form.formState.errors.fipe_value)}
                aria-describedby={form.formState.errors.fipe_value ? "fipe_value-error" : undefined}
                className={form.formState.errors.fipe_value ? "border-destructive focus-visible:ring-destructive/30" : undefined}
                {...form.register("fipe_value", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {form.formState.errors.fipe_value ? (
                <p id="fipe_value-error" className="text-xs text-destructive" role="alert">
                  {form.formState.errors.fipe_value.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Referência FIPE</div>
                  <div className="text-xs text-muted-foreground">
                    Usa marca, modelo e ano para buscar o valor de referência.
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchFipe}
                  disabled={busyFipe}
                  className="sm:w-auto"
                >
                  {busyFipe ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Buscando FIPE...
                    </>
                  ) : (
                    "Buscar FIPE"
                  )}
                </Button>
              </div>
              <Input
                id="fipe_reference"
                readOnly
                placeholder="Ex: janeiro de 2025"
                value={form.watch("fipe_reference") ?? ""}
                className="bg-muted/30"
              />
              {form.watch("fipe_code") ? (
                <p className="text-xs text-muted-foreground">
                  Código FIPE: <span className="font-mono">{form.watch("fipe_code")}</span>
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as VehicleFormValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel">Combustível</Label>
              <Input id="fuel" placeholder="Flex" {...form.register("fuel")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Câmbio</Label>
              <Input
                id="transmission"
                placeholder="Automático"
                {...form.register("transmission")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" placeholder="Prata" {...form.register("color")} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor="description_ai">Descrição (IA)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={generateDescriptionAi}
                disabled={busyAi}
                  className="sm:w-auto border-mg-border bg-mg-surface text-foreground hover:bg-mg-surface-2"
              >
                {busyAi ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar descrição com IA"
                )}
              </Button>
            </div>
            <Textarea
              id="description_ai"
              rows={7}
              placeholder="Clique em “Gerar descrição com IA” para criar um texto profissional de anúncio."
              {...form.register("description_ai")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              rows={5}
              placeholder="Histórico, opcionais, detalhes de negociação..."
              {...form.register("notes")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </fieldset>
      </form>
      </Card>
    </PremiumSurface>
  );
}

