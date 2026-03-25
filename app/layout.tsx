import type { Metadata } from "next";
import { Goldman, Prompt, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

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
  title: {
    default: "MotorGestor",
    template: "%s | MotorGestor",
  },
  description:
    "MotorGestor é o SaaS para pequenas revendas e vendedores que organiza estoque, leads, agenda e vendas — com visão de funil e métricas.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
