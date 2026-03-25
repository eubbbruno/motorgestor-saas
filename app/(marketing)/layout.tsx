import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export const metadata: Metadata = {
  title: "MotorGestor",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
