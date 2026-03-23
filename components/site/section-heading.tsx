import * as React from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "space-y-3",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-xl",
        className,
      )}
    >
      {eyebrow ? (
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-5 bg-foreground/10" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </span>
        </div>
      ) : null}
      <h2
        className={cn(
          "text-balance font-semibold tracking-tight",
          centered ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("text-pretty text-base text-muted-foreground sm:text-lg", centered ? "mx-auto" : "")}>
          {lead}
        </p>
      ) : null}
      {children ? <div className="pt-2">{children}</div> : null}
    </div>
  );
}

