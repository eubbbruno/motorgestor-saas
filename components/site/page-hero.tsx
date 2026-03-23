import * as React from "react";

import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden py-12 sm:py-18", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_30%_0%,rgba(59,130,246,.08),transparent_55%),radial-gradient(900px_circle_at_70%_30%,rgba(16,185,129,.08),transparent_55%)]" />
      <Container>
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          {eyebrow ? (
            <div className="inline-flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-foreground/10" />
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </div>
              <span className="h-px w-6 bg-foreground/10" />
            </div>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.05]">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {children ? <div className="pt-2">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}

