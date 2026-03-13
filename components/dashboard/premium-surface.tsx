"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function PremiumSurface({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative h-full rounded-2xl p-px",
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04),rgba(255,255,255,0.08))]",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full rounded-2xl border border-white/10",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]",
          "shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_30px_80px_rgba(0,0,0,0.55)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

