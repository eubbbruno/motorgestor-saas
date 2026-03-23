import * as React from "react";

import { cn } from "@/lib/utils";

export function MarketingCard({
  className,
  children,
  subtle = false,
}: {
  className?: string;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-background/60 p-6 shadow-sm backdrop-blur",
        "transition-[transform,box-shadow,background-color] duration-200 motion-safe:hover:-translate-y-0.5",
        subtle
          ? "border-foreground/10 hover:bg-background/70 hover:shadow-md"
          : "border-foreground/12 hover:bg-background/75 hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-emerald-400/5 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 size-64 rounded-full bg-blue-500/5 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

