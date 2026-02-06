import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "MotorGestor",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(16,185,129,.18),transparent_55%),radial-gradient(1000px_circle_at_100%_20%,rgba(59,130,246,.18),transparent_55%)]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

