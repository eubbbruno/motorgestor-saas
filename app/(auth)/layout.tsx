import Link from "next/link";

import { Container } from "@/components/site/container";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_30%_0%,rgba(59,130,246,.10),transparent_55%),radial-gradient(900px_circle_at_70%_30%,rgba(16,185,129,.10),transparent_55%)]" />
      <div className="border-b border-mg-border bg-background/75 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]" />
            MotorGestor
          </Link>
          <Link href="/precos" className="text-sm text-muted-foreground hover:text-foreground">
            Ver preços
          </Link>
        </Container>
      </div>
      <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 py-10 sm:py-14">{children}</div>
    </div>
  );
}

