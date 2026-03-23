"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  right,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        {kicker ? (
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-mg-fg-muted">
            {kicker}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-mg-fg-muted">{description}</p>
        ) : null}
      </div>
      {right ? <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{right}</div> : null}
    </div>
  );
}

