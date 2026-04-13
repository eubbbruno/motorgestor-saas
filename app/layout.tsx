import type { Metadata } from "next";
import { Goldman, Prompt, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Analytics } from "@/components/analytics";

const goldman = Goldman({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-goldman",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-prompt",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://motorgestor.com.br"),
  title: {
    default: "MotorGestor — Gestão Completa para Concessionárias",
    template: "%s | MotorGestor",
  },
  description:
    "Gerencie estoque, leads e vendas da sua concessionária em um só lugar. Integração com OLX, Webmotors e iCarros. Teste grátis por 14 dias.",
  keywords: [
    "gestão de concessionária",
    "CRM automotivo",
    "software para revenda de carros",
    "gestão de leads automotivos",
    "OLX integração",
    "Webmotors integração",
    "sistema para concessionária",
  ],
  authors: [{ name: "MotorGestor" }],
  creator: "MotorGestor",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://motorgestor.com.br",
    siteName: "MotorGestor",
    title: "MotorGestor — Gestão Completa para Concessionárias",
    description:
      "Gerencie estoque, leads e vendas da sua concessionária em um só lugar.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MotorGestor Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MotorGestor — Gestão Completa para Concessionárias",
    description:
      "Gerencie estoque, leads e vendas da sua concessionária em um só lugar.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: { google: "adicionar_depois" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${goldman.variable} ${prompt.variable} ${geistMono.variable} font-sans min-h-screen antialiased`}
      >
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
