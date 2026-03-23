"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function DashboardSectionHeading({
  title,
  description,
  kicker,
  right,
  className,
}: {
  title: string;
  description?: string;
  kicker?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        {kicker ? (
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-mg-fg-muted">
            {kicker}
          </div>
        ) : null}
        <div className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </div>
        {description ? (
          <p className="text-sm text-mg-fg-muted">{description}</p>
        ) : null}
      </div>
      {right ? <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{right}</div> : null}
    </div>
  );
}

