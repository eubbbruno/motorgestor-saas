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
    <section className={cn("py-12 sm:py-16", className)}>
      <Container>
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {eyebrow ? (
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
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

