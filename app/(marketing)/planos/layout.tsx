import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos e Preços",
  description:
    "Escolha o plano ideal para sua concessionária. A partir de R$ 97/mês. 14 dias grátis sem cartão.",
};

export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
