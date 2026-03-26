"use client";

import Link from "next/link";
import { Instagram, Share2, MessageCircle, Mail } from "lucide-react";

import { Container } from "@/components/site/container";

const cols = {
  Produto: [
    { href: "/recursos", label: "Recursos" },
    { href: "/planos", label: "Preços" },
    { href: "/integracoes", label: "Integrações" },
    { href: "/status", label: "Status" },
    { href: "/seguranca", label: "Segurança" },
  ],
  Empresa: [
    { href: "/sobre", label: "Sobre nós" },
    { href: "/blog", label: "Blog" },
    { href: "/parceiros", label: "Parceiros" },
    { href: "/carreiras", label: "Carreiras" },
  ],
  Contato: [
    { href: "/contato", label: "Fale conosco" },
    { href: "/suporte", label: "Suporte" },
    { href: "/politica-de-privacidade", label: "Privacidade" },
    { href: "/termos-de-uso", label: "Termos" },
  ],
};


export function SiteFooter() {
  return (
    <footer className="relative bg-[#080F0A] overflow-hidden">
      {/* Decorative top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4AE54A] to-transparent opacity-60" />
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[rgba(74,229,74,0.06)] to-transparent" />

      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-[rgba(74,229,74,0.04)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 size-80 rounded-full bg-[rgba(74,229,74,0.03)] blur-3xl" />

      <Container className="relative pt-16 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand col */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img src="/images/logo-motorgestor.png" alt="MotorGestor" className="h-12 w-auto" />
            </Link>

            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Operação de revenda sem planilha — funil, agenda, estoque e métricas em um só lugar.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {[
                { icon: Instagram, href: "https://instagram.com/motorgestor", label: "Instagram" },
                { icon: Share2, href: "https://facebook.com/motorgestor", label: "Facebook" },
                { icon: MessageCircle, href: "https://wa.me/5500000000000", label: "WhatsApp" },
                { icon: Mail, href: "mailto:contato@motorgestor.com.br", label: "E-mail" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="size-9 rounded-xl bg-[#0F2014] border border-[rgba(74,229,74,0.12)] flex items-center justify-center text-[#6B9E6B] hover:text-[#4AE54A] hover:border-[rgba(74,229,74,0.3)] hover:bg-[rgba(74,229,74,0.06)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {Object.entries(cols).map(([title, items]) => (
            <div key={title} className="space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-widest">{title}</div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#9CA3AF] hover:text-[#4AE54A] transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] p-6 mb-10 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.3)] to-transparent" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <div className="text-sm font-bold text-white mb-0.5">Novidades do MotorGestor</div>
              <div className="text-xs text-[#6B9E6B]">Dicas de vendas e updates do produto, sem spam.</div>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 sm:w-56 h-10 rounded-xl border border-[rgba(74,229,74,0.2)] bg-[#0A1A0C] px-4 text-sm text-white placeholder:text-[#6B9E6B]/50 focus:outline-none focus:border-[#4AE54A] transition-colors"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-[#4AE54A] text-[#0D1F1A] text-sm font-bold hover:bg-[#3dd13d] transition-colors shadow-[0_0_12px_rgba(74,229,74,0.3)] shrink-0"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[rgba(74,229,74,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B9E6B]/70">
          <span>© {new Date().getFullYear()} MotorGestor. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
