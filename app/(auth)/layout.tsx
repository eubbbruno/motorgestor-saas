import Link from "next/link";

import { Container } from "@/components/site/container";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-background/80 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            MotorGestor
          </Link>
          <Link href="/precos" className="text-sm text-muted-foreground hover:text-foreground">
            Ver preços
          </Link>
        </Container>
      </div>
      <div className="mx-auto flex max-w-lg flex-col px-4 py-10">{children}</div>
    </div>
  );
}

