"use client"

import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import { toast } from "sonner"
import { DownloadIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DarkPremiumTemplate,
  WhiteCleanTemplate,
  GradientBoldTemplate,
} from "@/components/social/post-templates"
import type { PostTemplateProps } from "@/components/social/post-templates"

type Vehicle = PostTemplateProps["vehicle"]
type Company = PostTemplateProps["company"]

interface PostModalProps {
  open: boolean
  onClose: () => void
  vehicle: Vehicle
  company: Company
  photoUrl?: string | null
}

const PRESET_COLORS = [
  { value: "#4AE54A", label: "Verde" },
  { value: "#E63946", label: "Vermelho" },
  { value: "#1D3557", label: "Azul" },
  { value: "#F4A261", label: "Laranja" },
  { value: "#2D6A4F", label: "Verde Escuro" },
]

const TEMPLATES = [
  {
    id: 1 as const,
    label: "Dark Premium",
    preview: "linear-gradient(180deg, #0D1F1A 0%, #000 100%)",
  },
  {
    id: 2 as const,
    label: "White Clean",
    preview: "#ffffff",
    border: true,
  },
  {
    id: 3 as const,
    label: "Gradient Bold",
    preview: "linear-gradient(135deg, #4AE54A 0%, #000 100%)",
  },
]

export function PostModal({ open, onClose, vehicle, company, photoUrl }: PostModalProps) {
  const [template, setTemplate] = useState<1 | 2 | 3>(1)
  const [primaryColor, setPrimaryColor] = useState("#4AE54A")
  const [showPrice, setShowPrice] = useState(true)
  const [showMileage, setShowMileage] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const hiddenRef = useRef<HTMLDivElement>(null)

  async function handleDownload() {
    if (!hiddenRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(hiddenRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        width: 1080,
        height: 1080,
        logging: false,
      })
      const dataUrl = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      const make = (vehicle.make ?? "veiculo").toLowerCase().replace(/\s+/g, "-")
      const model = (vehicle.model ?? "").toLowerCase().replace(/\s+/g, "-")
      const year = vehicle.year ?? ""
      link.download = `motorgestor-${make}-${model}-${year}.png`
      link.href = dataUrl
      link.click()
      toast.success("Post baixado com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Não foi possível gerar o post. Tente novamente.")
    } finally {
      setDownloading(false)
    }
  }

  const templateProps: PostTemplateProps = {
    vehicle,
    company,
    primaryColor,
    showPrice,
    showMileage,
    photoUrl,
  }

  const TemplateComponent =
    template === 1 ? DarkPremiumTemplate : template === 2 ? WhiteCleanTemplate : GradientBoldTemplate

  const SCALE = 0.3704 // 1080 * 0.3704 ≈ 400

  return (
    <>
      {/* Hidden full-resolution render for html2canvas */}
      <div
        ref={hiddenRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "1080px",
          height: "1080px",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <TemplateComponent {...templateProps} />
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-4xl w-full gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle>Gerar Post para Redes Sociais</DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-[auto_1fr] gap-0">
            {/* Preview */}
            <div className="flex flex-col items-center justify-center bg-[#0A0A0A] p-8">
              <div className="text-xs text-[#666] mb-3 uppercase tracking-wider">Preview 1080×1080</div>
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                    width: "1080px",
                    height: "1080px",
                  }}
                >
                  <TemplateComponent {...templateProps} />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-5 p-6 overflow-y-auto max-h-[600px]">
              {/* Template selector */}
              <div>
                <Label className="mb-3 block text-sm font-semibold">Template</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`rounded-xl border-2 p-3 text-xs font-medium transition-all text-left ${
                        template === t.id
                          ? "border-[#4AE54A] bg-[#4AE54A]/10 text-[#4AE54A]"
                          : "border-border text-muted-foreground hover:border-[#4AE54A]/50"
                      }`}
                    >
                      <div
                        style={{ background: t.preview }}
                        className={`mb-2 rounded-lg h-14 ${t.border ? "border border-border" : ""}`}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <Label className="mb-3 block text-sm font-semibold">Cor Primária</Label>
                <div className="flex gap-2 flex-wrap items-center">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setPrimaryColor(c.value)}
                      title={c.label}
                      style={{ backgroundColor: c.value }}
                      className={`size-8 rounded-full border-2 transition-all ${
                        primaryColor === c.value
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-8 rounded-full cursor-pointer border border-border bg-transparent p-0.5"
                    title="Cor personalizada"
                  />
                  <span className="text-xs text-muted-foreground ml-1 font-mono">{primaryColor}</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <Label className="block text-sm font-semibold">Conteúdo</Label>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <Label className="text-sm font-normal cursor-pointer">Mostrar preço</Label>
                  <Switch checked={showPrice} onCheckedChange={setShowPrice} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm font-normal cursor-pointer">Mostrar quilometragem</Label>
                  <Switch checked={showMileage} onCheckedChange={setShowMileage} />
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd43d] font-semibold"
                  size="lg"
                >
                  {downloading ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Gerando PNG...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="mr-2 size-4" />
                      Baixar PNG
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
