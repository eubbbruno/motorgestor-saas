import * as React from "react";
import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirectTo?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  return (
    <Suspense
      fallback={<Card className="bg-background/60 p-6">Carregando...</Card>}
    >
      <LoginForm redirectTo={sp.redirectTo ?? "/app"} />
    </Suspense>
  );
}

