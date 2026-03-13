"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2Icon, SearchIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OptionRow = { code: string; name: string; year?: number };

type OptionsResponse =
  | { ok: true; key: string; data: OptionRow[] }
  | { ok: false; error: string };

type FipeResponse =
  | { ok: true; value: number; reference: string; fipeCode?: string }
  | { ok: false; error: string };

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FipeQuickWidget({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [brandCode, setBrandCode] = React.useState<string>("");
  const [modelCode, setModelCode] = React.useState<string>("");
  const [yearCode, setYearCode] = React.useState<string>("");

  const [brands, setBrands] = React.useState<OptionRow[]>([]);
  const [models, setModels] = React.useState<OptionRow[]>([]);
  const [years, setYears] = React.useState<OptionRow[]>([]);

  const [loadingBrands, setLoadingBrands] = React.useState(false);
  const [loadingModels, setLoadingModels] = React.useState(false);
  const [loadingYears, setLoadingYears] = React.useState(false);
  const [loadingQuote, setLoadingQuote] = React.useState(false);

  const [quote, setQuote] = React.useState<{ value: number; reference: string; fipeCode?: string } | null>(
    null,
  );

  async function fetchOptions(params: { brandCode?: string; modelCode?: string }) {
    const url = new URL("/api/fipe/options", window.location.origin);
    if (params.brandCode) url.searchParams.set("brandCode", params.brandCode);
    if (params.modelCode) url.searchParams.set("modelCode", params.modelCode);
    const res = await fetch(url.toString(), { method: "GET" });
    const json = (await res.json().catch(() => null)) as OptionsResponse | null;
    if (!res.ok || !json || json.ok === false) {
      throw new Error(json && "error" in json ? json.error : "Falha ao carregar opções FIPE.");
    }
    return json.data ?? [];
  }

  React.useEffect(() => {
    let alive = true;
    setLoadingBrands(true);
    fetchOptions({})
      .then((data) => {
        if (!alive) return;
        setBrands(data);
      })
      .catch(() => {
        // widget não deve quebrar dashboard
      })
      .finally(() => {
        if (!alive) return;
        setLoadingBrands(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    let alive = true;
    setQuote(null);
    setModels([]);
    setYears([]);
    setModelCode("");
    setYearCode("");

    if (!brandCode) return;
    setLoadingModels(true);
    fetchOptions({ brandCode })
      .then((data) => {
        if (!alive) return;
        setModels(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!alive) return;
        setLoadingModels(false);
      });
    return () => {
      alive = false;
    };
  }, [brandCode]);

  React.useEffect(() => {
    let alive = true;
    setQuote(null);
    setYears([]);
    setYearCode("");
    if (!brandCode || !modelCode) return;
    setLoadingYears(true);
    fetchOptions({ brandCode, modelCode })
      .then((data) => {
        if (!alive) return;
        setYears(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!alive) return;
        setLoadingYears(false);
      });
    return () => {
      alive = false;
    };
  }, [brandCode, modelCode]);

  async function consult() {
    if (!brandCode || !modelCode || !yearCode) {
      toast.error("Selecione Marca, Modelo e Ano.");
      return;
    }
    setLoadingQuote(true);
    try {
      const res = await fetch("/api/fipe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brandCode, modelCode, yearCode }),
      });
      const json = (await res.json().catch(() => null)) as FipeResponse | null;
      if (!res.ok || !json || json.ok === false) {
        throw new Error(json && "error" in json ? json.error : "Falha ao consultar FIPE.");
      }
      setQuote({ value: json.value, reference: json.reference, fipeCode: json.fipeCode });
    } catch (err) {
      toast.error("Não foi possível consultar a FIPE.", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setLoadingQuote(false);
    }
  }

  return (
    <PremiumSurface>
      <div className={compact ? "relative overflow-hidden p-5" : "relative overflow-hidden p-6"}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-28 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.24),transparent_60%)] blur-2xl" />
          <div className="absolute -bottom-24 -left-28 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.22),transparent_60%)] blur-2xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              FIPE
            </div>
            <div className="text-sm text-white/60">Consulta rápida de preço médio.</div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
            <SparklesIcon className="size-4" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={compact ? "relative mt-4 space-y-2.5" : "relative mt-4 space-y-3"}
        >
          <div className={compact ? "grid gap-1.5" : "grid gap-2"}>
            <Select value={brandCode} onValueChange={setBrandCode} disabled={loadingBrands}>
              <SelectTrigger className="w-full border-white/10 bg-white/5 text-white data-placeholder:text-white/40">
                <SelectValue placeholder={loadingBrands ? "Carregando marcas..." : "Marca"} />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur">
                {brands.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={modelCode}
              onValueChange={setModelCode}
              disabled={!brandCode || loadingModels}
            >
              <SelectTrigger className="w-full border-white/10 bg-white/5 text-white data-placeholder:text-white/40">
                <SelectValue placeholder={!brandCode ? "Selecione uma marca" : loadingModels ? "Carregando modelos..." : "Modelo"} />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur">
                {models.map((m) => (
                  <SelectItem key={m.code} value={m.code}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearCode} onValueChange={setYearCode} disabled={!modelCode || loadingYears}>
              <SelectTrigger className="w-full border-white/10 bg-white/5 text-white data-placeholder:text-white/40">
                <SelectValue placeholder={!modelCode ? "Selecione um modelo" : loadingYears ? "Carregando anos..." : "Ano"} />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur">
                {years.map((y) => (
                  <SelectItem key={y.code} value={y.code}>
                    {y.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={consult}
            disabled={loadingQuote || !brandCode || !modelCode || !yearCode}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {loadingQuote ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <SearchIcon className="mr-2 size-4" />
                Consultar
              </>
            )}
          </Button>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            {quote ? (
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55">Preço médio</div>
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {formatBRL(quote.value)}
                </div>
                <div className="text-xs text-white/55">
                  Referência: {quote.reference}
                  {quote.fipeCode ? ` · Código: ${quote.fipeCode}` : ""}
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/55">
                Selecione Marca/Modelo/Ano para consultar.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PremiumSurface>
  );
}

