import Link from "next/link";
import { CarIcon } from "lucide-react";

import { Container } from "@/components/site/container";

const navLinks = {
  Navegação: [
    { href: "/", label: "Home" },
    { href: "/recursos", label: "Features" },
    { href: "/planos", label: "Preços" },
    { href: "/blog", label: "Blog" },
  ],
  Produto: [
    { href: "/recursos", label: "Recursos" },
    { href: "/integracoes", label: "Integrações" },
    { href: "/status", label: "Status" },
    { href: "/seguranca", label: "Segurança" },
  ],
  Contato: [
    { href: "/contato", label: "Fale conosco" },
    { href: "/suporte", label: "Suporte" },
    { href: "/parceiros", label: "Parceiros" },
    { href: "/carreiras", label: "Carreiras" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-[#0A1A12] border-t border-[rgba(74,229,74,0.08)]">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-white"
            >
              <div className="size-7 rounded-lg bg-[#4AE54A] flex items-center justify-center">
                <CarIcon className="size-4 text-[#0D1F1A]" />
              </div>
              MotorGestor
            </Link>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Operação de revenda sem planilha, com funil, agenda e estoque em
              um só lugar.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {[
                { label: "in", href: "#" },
                { label: "tw", href: "#" },
                { label: "ig", href: "#" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="size-8 rounded-lg bg-[#1A2E23] border border-[rgba(74,229,74,0.15)] flex items-center justify-center text-[10px] font-bold text-[#4AE54A] hover:bg-[#1A3A1A] transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(navLinks).map(([title, items]) => (
            <div key={title} className="space-y-3">
              <div className="text-sm font-semibold text-white">{title}</div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[rgba(74,229,74,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <span>
            © {new Date().getFullYear()} MotorGestor. Todos os direitos
            reservados.
          </span>
          <div className="flex gap-5">
            <Link
              href="/politica-de-privacidade"
              className="hover:text-white transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="hover:text-white transition-colors"
            >
              Termos
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
