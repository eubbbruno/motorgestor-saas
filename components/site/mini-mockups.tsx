import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function DotRow() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-foreground/20" />
      <span className="size-2 rounded-full bg-foreground/15" />
      <span className="size-2 rounded-full bg-foreground/10" />
    </div>
  );
}

function Bars({ heights }: { heights: number[] }) {
  return (
    <div className="grid h-full w-full grid-cols-10 items-end gap-1">
      {heights.map((h, idx) => (
        <div key={idx} className="rounded-sm bg-foreground/10" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 180 60" className="h-full w-full">
      <defs>
        <linearGradient id="sparkMini" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path
        d="M0,44 C22,40 26,20 46,24 C66,28 66,40 86,34 C108,28 114,10 132,16 C150,22 150,36 180,26 L180,60 L0,60 Z"
        fill="url(#sparkMini)"
      />
      <path
        d="M0,44 C22,40 26,20 46,24 C66,28 66,40 86,34 C108,28 114,10 132,16 C150,22 150,36 180,26"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MiniMockup({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border bg-background/60 p-3 shadow-sm",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-emerald-400/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-56 rounded-full bg-blue-500/8 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <DotRow />
          <div className="text-[11px] font-medium text-muted-foreground">{title}</div>
          <div className="h-2 w-10 rounded-full bg-foreground/10" />
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </Card>
  );
}

export function PipelineMiniMockup() {
  return (
    <MiniMockup title="Pipeline">
      <div className="grid grid-cols-3 gap-2">
        {["Novo", "Negociação", "Fechado"].map((t, idx) => (
          <div key={t} className="rounded-lg border bg-background/70 p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t}</div>
            <div className="mt-2 space-y-1.5">
              <div className={cn("h-6 rounded-md", idx === 1 ? "bg-foreground/8" : "bg-foreground/6")} />
              <div className="h-6 rounded-md bg-foreground/6" />
              {idx === 0 ? <div className="h-6 rounded-md bg-foreground/6" /> : null}
            </div>
          </div>
        ))}
      </div>
    </MiniMockup>
  );
}

export function FipeMiniMockup() {
  return (
    <MiniMockup title="FIPE automática">
      <div className="grid gap-2">
        <div className="rounded-lg border bg-background/70 p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Modelo</div>
          <div className="mt-2 h-7 rounded-md bg-foreground/6" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-background/70 p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Valor FIPE</div>
            <div className="mt-2 h-7 rounded-md bg-foreground/6" />
          </div>
          <div className="rounded-lg border bg-background/70 p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Referência</div>
            <div className="mt-2 h-7 rounded-md bg-foreground/6" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2">
          <div className="h-2 w-20 rounded bg-foreground/10" />
          <div className="h-8 w-28 rounded-md bg-foreground/10" />
        </div>
      </div>
    </MiniMockup>
  );
}

export function AiMiniMockup() {
  return (
    <MiniMockup title="IA para mensagens">
      <div className="grid gap-2">
        <div className="rounded-lg border bg-background/70 p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">WhatsApp</div>
          <div className="mt-2 space-y-2">
            <div className="h-3 w-[90%] rounded bg-foreground/8" />
            <div className="h-3 w-[74%] rounded bg-foreground/8" />
            <div className="h-3 w-[82%] rounded bg-foreground/8" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2">
          <div className="h-2 w-20 rounded bg-foreground/10" />
          <div className="h-8 w-32 rounded-md bg-emerald-400/20" />
        </div>
      </div>
    </MiniMockup>
  );
}

export function MetricsMiniMockup() {
  return (
    <MiniMockup title="Métricas">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border bg-background/70 p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Conversão</div>
          <div className="mt-2 h-7 w-16 rounded bg-foreground/8" />
          <div className="mt-2 h-2 w-full rounded bg-foreground/10">
            <div className="h-2 w-[46%] rounded bg-emerald-400/60" />
          </div>
        </div>
        <div className="rounded-lg border bg-background/70 p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fechados</div>
          <div className="mt-2 h-7 w-12 rounded bg-foreground/8" />
          <div className="mt-3 h-8">
            <Bars heights={[18, 30, 22, 40, 34, 50, 42, 58, 44, 52]} />
          </div>
        </div>
        <div className="col-span-2 rounded-lg border bg-background/70 p-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Evolução</div>
            <div className="h-2 w-14 rounded bg-foreground/10" />
          </div>
          <div className="mt-2 h-10">
            <Sparkline />
          </div>
        </div>
      </div>
    </MiniMockup>
  );
}

