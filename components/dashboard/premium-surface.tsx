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
        "relative h-full rounded-2xl",
        "bg-[#0F2014] border border-[rgba(74,229,74,0.12)]",
        "shadow-[0_0_20px_rgba(74,229,74,0.06)]",
        className,
      )}
    >
      <div className={cn("relative h-full rounded-2xl", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
