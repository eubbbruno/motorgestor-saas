import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Sparkline() {
  return (
    <svg viewBox="0 0 180 60" className="h-full w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d="M0,46 C20,44 24,18 44,22 C62,26 62,44 80,38 C98,32 104,10 124,16 C146,22 146,40 180,26 L180,60 L0,60 Z"
        fill="url(#spark)"
      />
      <path
        d="M0,46 C20,44 24,18 44,22 C62,26 62,44 80,38 C98,32 104,10 124,16 C146,22 146,40 180,26"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniBars() {
  return (
    <div className="grid h-full w-full grid-cols-8 items-end gap-1">
      {[24, 34, 18, 46, 30, 52, 40, 58].map((h, idx) => (
        <div
          key={idx}
          className="rounded-sm bg-foreground/10"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border bg-background/40 p-2 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 -bottom-28 size-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-lg border bg-background/60">
        <div className="flex items-center justify-between border-b bg-background/70 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground/20" />
            <span className="size-2 rounded-full bg-foreground/15" />
            <span className="size-2 rounded-full bg-foreground/10" />
          </div>
          <div className="text-xs font-medium text-muted-foreground">MotorGestor • Dashboard</div>
          <div className="h-2 w-16 rounded-full bg-foreground/10" />
        </div>

        <div className="grid min-h-[360px] grid-cols-12">
          <div className="col-span-4 border-r bg-background/50 p-4 sm:col-span-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400/80" />
              <div className="h-3 w-24 rounded bg-foreground/10" />
            </div>
            <div className="mt-4 space-y-2">
              {["Dashboard", "Veículos", "Leads", "Pipeline", "Agenda"].map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "h-8 rounded-lg px-3",
                    i === 0 ? "bg-foreground/8" : "bg-transparent",
                  )}
                >
                  <div className="flex h-full items-center gap-2">
                    <div className="size-3 rounded bg-foreground/10" />
                    <div className="h-3 w-20 rounded bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border bg-background/60 p-3">
              <div className="text-[11px] text-muted-foreground">Meta do mês</div>
              <div className="mt-2 h-2 w-full rounded-full bg-foreground/10">
                <div className="h-2 w-[62%] rounded-full bg-emerald-400/70" />
              </div>
              <div className="mt-2 text-xs font-medium">62%</div>
            </div>
          </div>

          <div className="col-span-8 p-4 sm:col-span-9">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="h-4 w-36 rounded bg-foreground/10" />
                <div className="h-3 w-56 rounded bg-foreground/8" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 rounded-lg border bg-background/70" />
                <div className="h-9 w-28 rounded-lg bg-foreground/10" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Total leads", "128"],
                ["Em negociação", "19"],
                ["Fechados", "7"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-background/70 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
                  <div className="mt-2 h-2 w-20 rounded bg-foreground/10" />
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-5">
              <div className="rounded-xl border bg-background/70 p-3 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Evolução (6 meses)
                  </div>
                  <div className="h-2 w-12 rounded bg-foreground/10" />
                </div>
                <div className="mt-3 h-24">
                  <Sparkline />
                </div>
              </div>
              <div className="rounded-xl border bg-background/70 p-3 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Funil (agora)
                  </div>
                  <div className="h-2 w-12 rounded bg-foreground/10" />
                </div>
                <div className="mt-3 h-24">
                  <MiniBars />
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {["Novo", "Negociação", "Fechado"].map((t) => (
                <div key={t} className="rounded-xl border bg-background/70 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{t}</div>
                  <div className="mt-2 space-y-2">
                    <div className="h-10 rounded-lg bg-foreground/6" />
                    <div className="h-10 rounded-lg bg-foreground/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

