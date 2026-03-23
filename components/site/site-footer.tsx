import Link from "next/link";

import { Container } from "@/components/site/container";

const links = {
  Produto: [
    { href: "/recursos", label: "Recursos" },
    { href: "/precos", label: "Preços" },
    { href: "/status", label: "Status" },
    { href: "/seguranca", label: "Segurança" },
    { href: "/integracoes", label: "Integrações" },
  ],
  Empresa: [
    { href: "/sobre", label: "Sobre" },
    { href: "/carreiras", label: "Carreiras" },
    { href: "/parceiros", label: "Parceiros" },
    { href: "/blog", label: "Blog" },
    { href: "/contato", label: "Contato" },
  ],
  Legal: [
    { href: "/politica-de-privacidade", label: "Privacidade" },
    { href: "/termos-de-uso", label: "Termos" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="relative border-t">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(16,185,129,.25),rgba(59,130,246,.25),transparent)]" />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-semibold">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.15)]" />
              <span>MotorGestor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Operação de revenda sem planilha, com funil, agenda e estoque em um
              só lugar.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MotorGestor. Todos os direitos
              reservados.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-3">
              <div className="text-sm font-medium tracking-tight">{title}</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
}

