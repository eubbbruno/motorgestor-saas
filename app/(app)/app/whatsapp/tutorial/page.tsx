import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  SmartphoneIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    title: "Crie sua conta Business no Meta",
    badge: "gratuito",
    icon: "🏢",
    description: "Acesse o Gerenciador de Negócios do Meta para criar ou verificar sua conta.",
    items: [
      { text: "Acesse o Meta Business Suite", link: { href: "https://business.facebook.com", label: "business.facebook.com" } },
      { text: 'Se já tem página no Facebook, sua conta Business já existe!' },
    ],
  },
  {
    number: 2,
    title: "Tenha um número dedicado",
    badge: null,
    icon: "📱",
    description: "O WhatsApp Business precisa de um número exclusivo, separado do pessoal.",
    items: [
      { text: "Use um chip separado do seu WhatsApp pessoal" },
      { text: "Pode ser uma linha pré-paga de qualquer operadora" },
    ],
  },
  {
    number: 3,
    title: "Conecte pelo MotorGestor",
    badge: null,
    icon: "🔗",
    description: "O processo é guiado e leva menos de 5 minutos.",
    items: [
      { text: 'Clique em "Conectar WhatsApp Business" na tela anterior' },
      { text: "Siga o processo de autorização do Facebook" },
    ],
  },
  {
    number: 4,
    title: "Pronto!",
    badge: "feito",
    icon: "✅",
    description: "Seu WhatsApp está ativo no MotorGestor.",
    items: [
      { text: "Seu WhatsApp está conectado e a IA já pode responder seus leads" },
    ],
  },
] as const;

export default function WhatsAppTutorialPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-2">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/app/whatsapp"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B9E6B] hover:text-[#4AE54A] transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          Voltar ao WhatsApp
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#25D366]/10 border border-[#25D366]/20">
            <SmartphoneIcon className="size-5 text-[#25D366]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Como conectar seu WhatsApp Business</h1>
            <p className="text-sm text-[#6B9E6B]">Siga os 4 passos abaixo e comece a atender em minutos</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6"
          >
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <span className="absolute left-[2.65rem] top-full h-4 w-px bg-[rgba(74,229,74,0.15)]" />
            )}

            <div className="flex gap-4">
              {/* Step number */}
              <div className="shrink-0 flex size-9 items-center justify-center rounded-full border border-[rgba(74,229,74,0.25)] bg-[rgba(74,229,74,0.08)] text-sm font-bold text-[#4AE54A]">
                {step.number}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{step.icon}</span>
                  <h2 className="text-base font-semibold text-white">{step.title}</h2>
                  {step.badge === "gratuito" && (
                    <span className="rounded-full border border-[#4AE54A]/30 bg-[#4AE54A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4AE54A]">
                      gratuito
                    </span>
                  )}
                  {step.badge === "feito" && (
                    <CheckCircleIcon className="size-4 text-[#25D366]" />
                  )}
                </div>

                <p className="text-sm text-[#6B9E6B]">{step.description}</p>

                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRightIcon className="mt-0.5 size-3.5 shrink-0 text-[#4AE54A]/60" />
                      <span className="text-sm text-[#9CA3AF]">
                        {item.text}
                        {"link" in item && item.link && (
                          <>
                            {" — "}
                            <a
                              href={item.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#4AE54A] hover:underline"
                            >
                              {item.link.label}
                              <ExternalLinkIcon className="size-3" />
                            </a>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 p-6 text-center space-y-3">
        <ZapIcon className="mx-auto size-8 text-[#25D366]" />
        <div>
          <p className="font-semibold text-white">Pronto para conectar?</p>
          <p className="text-sm text-[#6B9E6B] mt-1">Você precisa de cerca de 5 minutos e o celular com o chip dedicado em mãos.</p>
        </div>
        <Button asChild className="bg-[#25D366] text-white hover:bg-[#1da851] font-semibold">
          <Link href="/app/whatsapp">
            Conectar WhatsApp Business
          </Link>
        </Button>
      </div>
    </div>
  );
}
