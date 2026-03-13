"use client";

import * as React from "react";

import { PremiumSurface } from "@/components/dashboard/premium-surface";

export function DashboardPanel({
  title,
  description,
  icon,
  right,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PremiumSurface>
      <div className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {icon ? (
                <div className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10">
                  {icon}
                </div>
              ) : null}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-white">
                  {title}
                </div>
                {description ? (
                  <div className="truncate text-xs text-white/55">{description}</div>
                ) : null}
              </div>
            </div>
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
        <div className="mt-4 min-h-0 flex-1">{children}</div>
      </div>
    </PremiumSurface>
  );
}

