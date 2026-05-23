"use client";

import * as React from "react";
import Script from "next/script";
import { AlertTriangleIcon, CheckCircleIcon, Loader2Icon, SmartphoneIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    FB: {
      init: (params: Record<string, unknown>) => void;
      login: (
        callback: (response: { authResponse?: { code?: string } }) => void,
        options: Record<string, unknown>,
      ) => void;
    };
  }
}

type Props = {
  onSuccess: (phoneNumber: string) => void;
};

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "";
const CONFIG_ID = process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID ?? "";

export function WhatsAppEmbeddedSignup({ onSuccess }: Props) {
  const [sdkReady, setSdkReady] = React.useState(false);
  const [sdkError, setSdkError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  function handleSdkLoad() {
    try {
      if (!window.FB) {
        setSdkError("window.FB não definido após carregamento do script.");
        return;
      }
      window.FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v19.0",
      });
      setSdkReady(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSdkError(`FB.init falhou: ${msg}`);
    }
  }

  function handleSdkError() {
    setSdkError("Falha ao carregar o script do Facebook SDK. Verifique sua conexão ou bloqueador de anúncios.");
  }

  function launchEmbeddedSignup() {
    if (!sdkReady || !window.FB) {
      toast.error("SDK do Facebook não carregou ainda.", {
        description: sdkError ?? "Aguarde alguns segundos e tente novamente.",
      });
      return;
    }

    if (!APP_ID) {
      toast.error("NEXT_PUBLIC_FACEBOOK_APP_ID não configurado.", {
        description: "Adicione a variável de ambiente e faça redeploy.",
      });
      return;
    }

    if (!CONFIG_ID) {
      toast.error("NEXT_PUBLIC_WHATSAPP_CONFIG_ID não configurado.", {
        description: "Crie o Configurador no Meta for Developers e adicione a variável.",
      });
      return;
    }

    setLoading(true);

    try {
      window.FB.login(
        function (response) {
          const code = response.authResponse?.code;
          if (!code) {
            toast.error("Autorização cancelada ou negada pelo Facebook.");
            setLoading(false);
            return;
          }
          handleSignupResponse(code);
        },
        {
          config_id: CONFIG_ID,
          response_type: "code",
          override_default_response_type: true,
          extras: {
            setup: {},
            featureName: "whatsapp_embedded_signup",
            sessionInfoVersion: "3",
          },
        },
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("FB.login lançou exceção.", { description: msg });
      setLoading(false);
    }
  }

  async function handleSignupResponse(code: string) {
    try {
      const res = await fetch("/api/whatsapp/embedded-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error ?? "Erro ao conectar WhatsApp.");
      }

      toast.success("WhatsApp Business conectado!");
      onSuccess(data.phone_number ?? "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      toast.error("Falha ao salvar conexão.", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  // ── Status indicators ──────────────────────────────────────────────────────
  const checks = [
    {
      label: "Facebook SDK",
      ok: sdkReady,
      error: sdkError,
      pending: !sdkReady && !sdkError,
    },
    {
      label: `App ID: ${APP_ID ? `...${APP_ID.slice(-4)}` : "⚠️ vazio"}`,
      ok: Boolean(APP_ID),
      error: APP_ID ? null : "NEXT_PUBLIC_FACEBOOK_APP_ID não definido",
      pending: false,
    },
    {
      label: `Config ID: ${CONFIG_ID ? `...${CONFIG_ID.slice(-4)}` : "⚠️ vazio"}`,
      ok: Boolean(CONFIG_ID),
      error: CONFIG_ID ? null : "NEXT_PUBLIC_WHATSAPP_CONFIG_ID não definido",
      pending: false,
    },
  ];

  const allOk = checks.every(c => c.ok);

  return (
    <>
      <Script
        src="https://connect.facebook.net/pt_BR/sdk.js"
        strategy="afterInteractive"
        onLoad={handleSdkLoad}
        onError={handleSdkError}
      />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-8 text-center space-y-6">
          {/* WhatsApp icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#25D366]/10 border border-[#25D366]/20">
            <svg viewBox="0 0 24 24" className="size-10" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Conecte seu WhatsApp Business</h2>
            <p className="text-sm text-[#6B9E6B] leading-relaxed">
              Conecte o número da sua concessionária para começar a atender leads pelo WhatsApp com IA.
            </p>
          </div>

          {/* Debug status panel */}
          <div className="rounded-xl border border-[rgba(74,229,74,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-3 text-left space-y-1.5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                {c.pending ? (
                  <Loader2Icon className="size-3.5 mt-0.5 animate-spin text-[#6B9E6B]/50 shrink-0" />
                ) : c.ok ? (
                  <CheckCircleIcon className="size-3.5 mt-0.5 text-[#4AE54A] shrink-0" />
                ) : (
                  <AlertTriangleIcon className="size-3.5 mt-0.5 text-amber-400 shrink-0" />
                )}
                <div>
                  <span className={`text-[11px] font-mono ${c.ok ? "text-[#4AE54A]" : c.pending ? "text-[#6B9E6B]/60" : "text-amber-400"}`}>
                    {c.label}
                  </span>
                  {c.error && (
                    <p className="text-[10px] text-red-400/80 mt-0.5">{c.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={launchEmbeddedSignup}
            disabled={loading || !allOk}
            className="w-full h-11 bg-[#25D366] text-white hover:bg-[#1da851] font-semibold text-sm rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Conectando...
              </>
            ) : !sdkReady && !sdkError ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Carregando SDK...
              </>
            ) : (
              "Conectar WhatsApp Business"
            )}
          </Button>

          {!allOk && !loading && (
            <p className="text-[11px] text-amber-400/80">
              Resolva os itens acima antes de conectar.
            </p>
          )}

          <ul className="text-left space-y-2">
            {[
              "Atendimento automático com IA",
              "Histórico completo de conversas",
              "Criação de leads direto do chat",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span className="size-4 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0">
                  <SmartphoneIcon className="size-2.5 text-[#25D366]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
