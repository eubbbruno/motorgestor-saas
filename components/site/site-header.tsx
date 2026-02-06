import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";

const nav = [
  { href: "/recursos", label: "Recursos" },
  { href: "/precos", label: "Preços" },
  { href: "/integracoes", label: "Integrações" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.15)]" />
            <span className="text-base">MotorGestor</span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/cadastro">Começar agora</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}

