"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BotIcon,
  BrainIcon,
  CarIcon,
  ClockIcon,
  HelpCircleIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// ─── Types ────────────────────────────────────────────────────────────────────

type Faq = { question: string; answer: string };

type TrainingForm = {
  store_name: string;
  store_description: string;
  working_hours: string;
  location: string;
  payment_methods: string;
  warranty_policy: string;
  differentials: string;
  attendant_name: string;
  tone: "friendly" | "formal" | "casual";
  response_delay_min: number;
  response_delay_max: number;
  ai_enabled: boolean;
  custom_faqs: Faq[];
  include_prices: boolean;
  include_mileage: boolean;
};

const DEFAULT_FORM: TrainingForm = {
  store_name: "",
  store_description: "",
  working_hours: "Segunda a sábado, 9h às 18h",
  location: "",
  payment_methods: "Financiamento, consórcio, à vista, cartão de crédito",
  warranty_policy: "30 dias ou 1.000 km (o que ocorrer primeiro)",
  differentials: "",
  attendant_name: "Carlos",
  tone: "friendly",
  response_delay_min: 3,
  response_delay_max: 8,
  ai_enabled: true,
  custom_faqs: [],
  include_prices: true,
  include_mileage: true,
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchTraining(): Promise<TrainingForm | null> {
  const res = await fetch("/api/ai/training");
  const data = await res.json();
  return data.ok && data.data ? data.data : null;
}

async function saveTraining(body: TrainingForm): Promise<void> {
  const res = await fetch("/api/ai/training", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "Erro ao salvar.");
}

async function fetchVehicleCount(): Promise<number> {
  const res = await fetch("/api/whatsapp/conversations").catch(() => null);
  // We just need the vehicle count — reuse conversations endpoint placeholder
  // Actually fetch from a simple endpoint; for now return 0
  return 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrainamentoPage() {
  const qc = useQueryClient();
  const [form, setForm] = React.useState<TrainingForm>(DEFAULT_FORM);
  const [loaded, setLoaded] = React.useState(false);

  const { data: training, isLoading } = useQuery({
    queryKey: ["ai", "training"],
    queryFn: fetchTraining,
  });

  React.useEffect(() => {
    if (training && !loaded) {
      setForm({ ...DEFAULT_FORM, ...training });
      setLoaded(true);
    }
  }, [training, loaded]);

  const saveMutation = useMutation({
    mutationFn: saveTraining,
    onSuccess: () => {
      toast.success("Configuração salva com sucesso.");
      qc.invalidateQueries({ queryKey: ["ai", "training"] });
    },
    onError: (err: Error) => toast.error("Não foi possível salvar.", { description: err.message }),
  });

  function setField<K extends keyof TrainingForm>(key: K, value: TrainingForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addFaq() {
    setForm(f => ({ ...f, custom_faqs: [...f.custom_faqs, { question: "", answer: "" }] }));
  }

  function updateFaq(i: number, field: keyof Faq, value: string) {
    setForm(f => ({
      ...f,
      custom_faqs: f.custom_faqs.map((faq, idx) => idx === i ? { ...faq, [field]: value } : faq),
    }));
  }

  function removeFaq(i: number) {
    setForm(f => ({ ...f, custom_faqs: f.custom_faqs.filter((_, idx) => idx !== i) }));
  }

  const inputCls = "border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] text-white placeholder:text-[#6B9E6B]/40 focus-visible:ring-[#4AE54A]/30";
  const labelCls = "text-xs text-[#6B9E6B]";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="size-6 animate-spin text-[#4AE54A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="WhatsApp IA"
        title="Treinamento da IA"
        description="Configure como o assistente virtual responde aos seus leads."
      />

      {/* Global AI toggle */}
      <PremiumSurface>
        <Card className="rounded-2xl border-0 bg-transparent px-6 py-4 shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#4AE54A]/10">
                <BotIcon className="size-5 text-[#4AE54A]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Atendimento automático por IA</div>
                <div className="text-xs text-[#6B9E6B]">
                  {form.ai_enabled ? "IA ativa — respondendo automaticamente" : "IA desativada — respostas manuais"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={form.ai_enabled
                ? "border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-[10px]"
                : "border border-[#6B9E6B]/20 bg-transparent text-[#6B9E6B] text-[10px]"
              }>
                {form.ai_enabled ? "Ativa" : "Pausada"}
              </Badge>
              <Switch
                checked={form.ai_enabled}
                onCheckedChange={v => setField("ai_enabled", v)}
              />
            </div>
          </div>
        </Card>
      </PremiumSurface>

      {/* Tabs */}
      <Tabs defaultValue="loja">
        <TabsList className="bg-[#0A1A0C] border border-[rgba(74,229,74,0.15)] rounded-xl p-1">
          <TabsTrigger value="loja" className="data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C] text-[#6B9E6B] rounded-lg text-xs">
            Sobre a loja
          </TabsTrigger>
          <TabsTrigger value="personalidade" className="data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C] text-[#6B9E6B] rounded-lg text-xs">
            Personalidade
          </TabsTrigger>
          <TabsTrigger value="faqs" className="data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C] text-[#6B9E6B] rounded-lg text-xs">
            Perguntas frequentes
          </TabsTrigger>
          <TabsTrigger value="estoque" className="data-[state=active]:bg-[#4AE54A] data-[state=active]:text-[#0A1A0C] text-[#6B9E6B] rounded-lg text-xs">
            Estoque
          </TabsTrigger>
        </TabsList>

        {/* ── Aba: Sobre a loja ─────────────────────────────────── */}
        <TabsContent value="loja">
          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <BrainIcon className="size-4 text-[#4AE54A]" />
                Informações da loja
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Nome da loja</Label>
                  <Input value={form.store_name} onChange={e => setField("store_name", e.target.value)}
                    placeholder="Ex: MotorGestor Seminovos" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Nome do atendente virtual</Label>
                  <Input value={form.attendant_name} onChange={e => setField("attendant_name", e.target.value)}
                    placeholder="Ex: Carlos, Ana, João" className={inputCls} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className={labelCls}>Apresentação da loja (como a IA deve se apresentar)</Label>
                <Textarea
                  rows={3}
                  value={form.store_description}
                  onChange={e => setField("store_description", e.target.value)}
                  placeholder="Ex: Somos uma loja de seminovos com 10 anos de mercado, focada em veículos premium com procedência garantida..."
                  className={inputCls}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelCls}>
                    <ClockIcon className="inline size-3 mr-1" />
                    Horário de funcionamento
                  </Label>
                  <Input value={form.working_hours} onChange={e => setField("working_hours", e.target.value)}
                    placeholder="Ex: Seg-Sex 9h-18h, Sáb 9h-13h" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>
                    <MapPinIcon className="inline size-3 mr-1" />
                    Endereço / Localização
                  </Label>
                  <Input value={form.location} onChange={e => setField("location", e.target.value)}
                    placeholder="Ex: Av. Brasil, 1234 – Londrina, PR" className={inputCls} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Formas de pagamento</Label>
                  <Input value={form.payment_methods} onChange={e => setField("payment_methods", e.target.value)}
                    placeholder="Ex: Financiamento, consórcio, à vista" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>
                    <ShieldCheckIcon className="inline size-3 mr-1" />
                    Política de garantia
                  </Label>
                  <Input value={form.warranty_policy} onChange={e => setField("warranty_policy", e.target.value)}
                    placeholder="Ex: 30 dias ou 1.000 km" className={inputCls} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className={labelCls}>
                  <SparklesIcon className="inline size-3 mr-1" />
                  Diferenciais da loja
                </Label>
                <Textarea
                  rows={2}
                  value={form.differentials}
                  onChange={e => setField("differentials", e.target.value)}
                  placeholder="Ex: Revisão incluída na compra, laudo cautelar em todos os veículos, parceria com todos os bancos..."
                  className={inputCls}
                />
              </div>
            </Card>
          </PremiumSurface>
        </TabsContent>

        {/* ── Aba: Personalidade ────────────────────────────────── */}
        <TabsContent value="personalidade">
          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <SparklesIcon className="size-4 text-[#4AE54A]" />
                Personalidade do atendente
              </div>

              {/* Tom de voz */}
              <div className="space-y-3">
                <Label className={labelCls}>Tom de voz</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {([
                    { value: "friendly", label: "Amigável", desc: "Próximo e descontraído, como um amigo" },
                    { value: "formal", label: "Formal", desc: "Profissional e respeitoso" },
                    { value: "casual", label: "Casual", desc: "Jovem, informal e descolado" },
                  ] as const).map(t => (
                    <button
                      key={t.value}
                      onClick={() => setField("tone", t.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        form.tone === t.value
                          ? "border-[#4AE54A]/50 bg-[#4AE54A]/10"
                          : "border-[rgba(74,229,74,0.1)] hover:border-[rgba(74,229,74,0.2)]"
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{t.label}</div>
                      <div className="mt-0.5 text-[10px] text-[#6B9E6B]">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delay */}
              <div className="space-y-3">
                <Label className={labelCls}>
                  Delay de resposta: {form.response_delay_min}s – {form.response_delay_max}s
                  <span className="ml-2 text-[#6B9E6B]/50">(simula digitação humana)</span>
                </Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#6B9E6B]/60">Mínimo: {form.response_delay_min}s</span>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={form.response_delay_min}
                      onChange={e => setField("response_delay_min", Number(e.target.value))}
                      className="w-full accent-[#4AE54A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#6B9E6B]/60">Máximo: {form.response_delay_max}s</span>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={form.response_delay_max}
                      onChange={e => setField("response_delay_max", Number(e.target.value))}
                      className="w-full accent-[#4AE54A]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#6B9E6B]/50">
                  Nota: delays acima de 8s podem exceder o timeout do servidor em planos básicos da Vercel.
                </p>
              </div>
            </Card>
          </PremiumSurface>
        </TabsContent>

        {/* ── Aba: FAQs ─────────────────────────────────────────── */}
        <TabsContent value="faqs">
          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <HelpCircleIcon className="size-4 text-[#4AE54A]" />
                  Perguntas frequentes
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[rgba(74,229,74,0.2)] text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white text-xs h-7"
                  onClick={addFaq}
                >
                  <PlusIcon className="mr-1 size-3" />
                  Adicionar pergunta
                </Button>
              </div>

              {form.custom_faqs.length === 0 && (
                <div className="rounded-xl border border-dashed border-[rgba(74,229,74,0.15)] p-8 text-center">
                  <HelpCircleIcon className="mx-auto size-8 text-[#6B9E6B]/20 mb-2" />
                  <p className="text-xs text-[#6B9E6B]/50">
                    Nenhuma FAQ adicionada. Clique em "Adicionar pergunta" para começar.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {form.custom_faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#4AE54A]/70 uppercase tracking-wider">
                        Pergunta {i + 1}
                      </span>
                      <button
                        onClick={() => removeFaq(i)}
                        className="text-[#6B9E6B]/50 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="size-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Pergunta</Label>
                      <Input
                        value={faq.question}
                        onChange={e => updateFaq(i, "question", e.target.value)}
                        placeholder="Ex: Vocês fazem financiamento para negativados?"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Resposta</Label>
                      <Textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => updateFaq(i, "answer", e.target.value)}
                        placeholder="Ex: Trabalhamos com algumas financeiras que analisam caso a caso. Me conta sua situação que verifico as opções!"
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </PremiumSurface>
        </TabsContent>

        {/* ── Aba: Estoque ──────────────────────────────────────── */}
        <TabsContent value="estoque">
          <PremiumSurface>
            <Card className="rounded-2xl border-0 bg-transparent p-6 shadow-none space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <CarIcon className="size-4 text-[#4AE54A]" />
                Contexto do estoque
              </div>

              <div className="rounded-xl border border-[rgba(74,229,74,0.15)] bg-[rgba(74,229,74,0.04)] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4AE54A]/15">
                    <BotIcon className="size-4 text-[#4AE54A]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white mb-1">Acesso automático ao estoque</div>
                    <p className="text-xs text-[#6B9E6B] leading-relaxed">
                      A IA tem acesso automático a todos os veículos cadastrados como <strong className="text-white">disponíveis</strong> no MotorGestor.
                      Sempre que um cliente perguntar sobre estoque, a IA consultará os dados em tempo real.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] px-4 py-3">
                  <div>
                    <div className="text-xs font-medium text-white">Incluir preços nas respostas</div>
                    <div className="text-[10px] text-[#6B9E6B]">A IA informará o valor de cada veículo</div>
                  </div>
                  <Switch
                    checked={form.include_prices}
                    onCheckedChange={v => setField("include_prices", v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] px-4 py-3">
                  <div>
                    <div className="text-xs font-medium text-white">Mencionar quilometragem</div>
                    <div className="text-[10px] text-[#6B9E6B]">A IA incluirá o km dos veículos ao apresentar</div>
                  </div>
                  <Switch
                    checked={form.include_mileage}
                    onCheckedChange={v => setField("include_mileage", v)}
                  />
                </div>
              </div>
            </Card>
          </PremiumSurface>
        </TabsContent>
      </Tabs>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            <SaveIcon className="mr-2 size-4" />
          )}
          Salvar configurações
        </Button>
      </div>
    </div>
  );
}
