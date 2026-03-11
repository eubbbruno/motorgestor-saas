"use client";

import * as React from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileUpIcon, Loader2Icon } from "lucide-react";

import { useMyProfile } from "@/features/auth/hooks";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CsvRow = Record<string, string>;

type SystemFieldKey = "name" | "phone" | "email" | "vehicle_interest" | "notes";

const systemFields: Array<{
  key: SystemFieldKey;
  label: string;
  required?: boolean;
  help?: string;
}> = [
  { key: "name", label: "Nome", required: true },
  { key: "phone", label: "Telefone / WhatsApp" },
  { key: "email", label: "E-mail" },
  {
    key: "vehicle_interest",
    label: "Veículo de interesse",
    help: "Esse campo será adicionado nas observações (não é vínculo automático).",
  },
  { key: "notes", label: "Observações" },
];

function normalizeHeader(s: string) {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "_");
}

function guessMapping(headers: string[]) {
  const normalized = headers.map((h) => ({ raw: h, n: normalizeHeader(h) }));
  const pick = (candidates: string[]) => {
    const found = normalized.find((h) => candidates.includes(h.n));
    return found?.raw ?? "";
  };

  const mapping: Record<SystemFieldKey, string> = {
    name: pick(["nome", "name", "lead", "cliente"]),
    phone: pick(["telefone", "celular", "whatsapp", "fone", "phone"]),
    email: pick(["email", "e_mail", "mail"]),
    vehicle_interest: pick(["veiculo_interesse", "veiculo", "carro", "modelo", "interesse"]),
    notes: pick(["observacoes", "observacao", "obs", "notas", "notes"]),
  };

  return mapping;
}

function safeStr(v: unknown) {
  return (v ?? "").toString().trim();
}

export default function ImportarLeadsPage() {
  const router = useRouter();
  const profile = useMyProfile();

  const [fileName, setFileName] = React.useState<string>("");
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<CsvRow[]>([]);
  const [mapping, setMapping] = React.useState<Record<SystemFieldKey, string>>({
    name: "",
    phone: "",
    email: "",
    vehicle_interest: "",
    notes: "",
  });

  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<{
    total: number;
    imported: number;
    skipped: number;
  } | null>(null);

  function resetAll() {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setMapping({ name: "", phone: "", email: "", vehicle_interest: "", notes: "" });
    setResult(null);
  }

  async function onPickFile(file: File | null) {
    resetAll();
    if (!file) return;
    setFileName(file.name);

    const text = await file.text();
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => (h ?? "").toString().trim(),
      dynamicTyping: false,
    });

    if (parsed.errors?.length) {
      toast.error("Não foi possível ler o CSV.", { description: parsed.errors[0]?.message });
      return;
    }

    const data = (parsed.data ?? []).filter(Boolean);
    const cols = (parsed.meta.fields ?? []).filter(Boolean) as string[];
    if (!cols.length) {
      toast.error("CSV sem cabeçalhos.", { description: "Inclua a primeira linha com nomes das colunas." });
      return;
    }

    setHeaders(cols);
    setRows(
      data.map((r) => {
        const obj: CsvRow = {};
        cols.forEach((c) => {
          obj[c] = safeStr((r as Record<string, unknown>)[c]);
        });
        return obj;
      }),
    );
    setMapping(guessMapping(cols));
  }

  const preview = rows.slice(0, 8);
  const canImport = Boolean(profile.data?.company_id) && Boolean(headers.length) && Boolean(rows.length);
  const nameMapped = Boolean(mapping.name);

  async function importCsv() {
    if (!profile.data?.company_id) {
      toast.error("Sua empresa ainda não está configurada.");
      router.push("/app/onboarding");
      return;
    }
    if (!nameMapped) {
      toast.error("Mapeie a coluna de Nome para importar.");
      return;
    }

    setImporting(true);
    setResult(null);
    try {
      const supabase = createSupabaseBrowserClient();

      const toInsert: Array<{
        company_id: string;
        name: string;
        phone: string | null;
        email: string | null;
        source: string | null;
        status: "novo";
        vehicle_id: string | null;
        notes: string | null;
        last_contact_at: string;
      }> = [];

      let skipped = 0;

      for (const r of rows) {
        const name = safeStr(r[mapping.name]);
        const phone = mapping.phone ? safeStr(r[mapping.phone]) : "";
        const email = mapping.email ? safeStr(r[mapping.email]) : "";
        const interest = mapping.vehicle_interest ? safeStr(r[mapping.vehicle_interest]) : "";
        const notes = mapping.notes ? safeStr(r[mapping.notes]) : "";

        const allEmpty = [name, phone, email, interest, notes].every((x) => !x);
        if (allEmpty) {
          skipped += 1;
          continue;
        }

        if (!name || name.length < 2) {
          skipped += 1;
          continue;
        }

        const mergedNotesParts: string[] = [];
        if (notes) mergedNotesParts.push(notes);
        if (interest) mergedNotesParts.push(`Veículo de interesse (importado): ${interest}`);
        const mergedNotes = mergedNotesParts.length ? mergedNotesParts.join("\n") : null;

        toInsert.push({
          company_id: profile.data.company_id,
          name,
          phone: phone || null,
          email: email || null,
          source: "Importação CSV",
          status: "novo",
          vehicle_id: null,
          notes: mergedNotes,
          last_contact_at: new Date().toISOString(),
        });
      }

      if (!toInsert.length) {
        toast.error("Nada para importar.", { description: "Todas as linhas estavam vazias ou inválidas." });
        setResult({ total: rows.length, imported: 0, skipped });
        return;
      }

      const batchSize = 200;
      let imported = 0;

      for (let i = 0; i < toInsert.length; i += batchSize) {
        const chunk = toInsert.slice(i, i + batchSize);
        const { error } = await supabase.from("leads").insert(chunk);
        if (error) throw error;
        imported += chunk.length;
      }

      toast.success("Importação concluída.", {
        description: `${imported} leads importados. ${skipped} linhas ignoradas.`,
      });
      setResult({ total: rows.length, imported, skipped });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao importar.";
      toast.error("Não foi possível importar.", { description: message });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Importar leads</h1>
        <p className="text-sm text-muted-foreground">
          Faça upload de um CSV e importe seus leads com status <span className="font-medium">novo</span>.
        </p>
      </div>

      <Card className="bg-background/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Label htmlFor="csv">CSV</Label>
            <Input
              id="csv"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => void onPickFile(e.currentTarget.files?.[0] ?? null)}
              disabled={importing}
            />
            <div className="text-xs text-muted-foreground">
              Colunas esperadas: nome, telefone, email, veiculo_interesse, observacoes (você poderá mapear).
            </div>
            {fileName ? (
              <div className="text-xs">
                Arquivo: <span className="font-medium">{fileName}</span>
              </div>
            ) : null}
          </div>

          <Button onClick={importCsv} disabled={!canImport || importing || !nameMapped}>
            {importing ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <FileUpIcon className="mr-2 size-4" />
                Importar
              </>
            )}
          </Button>
        </div>

        {!profile.data?.company_id && profile.isLoading ? (
          <div className="mt-4 text-sm text-muted-foreground">Carregando perfil...</div>
        ) : !profile.data?.company_id ? (
          <div className="mt-4 text-sm text-destructive">
            Você precisa concluir o onboarding antes de importar.
          </div>
        ) : null}

        {headers.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-medium">Mapeamento de colunas</div>
              <div className="grid gap-3">
                {systemFields.map((f) => (
                  <div key={f.key} className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label>
                        {f.label} {f.required ? <span className="text-destructive">*</span> : null}
                      </Label>
                      {f.help ? <span className="text-xs text-muted-foreground">{f.help}</span> : null}
                    </div>
                    <Select
                      value={mapping[f.key] ?? ""}
                      onValueChange={(v) => setMapping((m) => ({ ...m, [f.key]: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Não importar</SelectItem>
                        {headers.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              {!nameMapped ? (
                <div className="text-sm text-destructive">
                  Mapeie a coluna <span className="font-medium">Nome</span> para habilitar a importação.
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Prévia</div>
              <Card className="bg-background/40 p-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.slice(0, 4).map((h) => (
                        <TableHead key={h} className="max-w-40 truncate">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((r, idx) => (
                      <TableRow key={idx}>
                        {headers.slice(0, 4).map((h) => (
                          <TableCell key={h} className="max-w-40 truncate">
                            {r[h] || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {result ? (
                <div className="rounded-xl border bg-background/40 p-4 text-sm">
                  <div className="font-medium">Resultado</div>
                  <div className="mt-1 text-muted-foreground">
                    Total: {result.total} · Importados:{" "}
                    <span className="font-medium text-foreground">{result.imported}</span> · Ignorados:{" "}
                    <span className="font-medium text-foreground">{result.skipped}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-sm text-muted-foreground">
            Envie um CSV para configurar o mapeamento.
          </div>
        )}
      </Card>
    </div>
  );
}

