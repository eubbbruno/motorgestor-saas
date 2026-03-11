import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function WindowTopbar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b bg-background/70 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/10" />
      </div>
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="h-2 w-16 rounded-full bg-foreground/10" />
    </div>
  );
}

export function PipelineScreenshot({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden rounded-xl border bg-background/40 p-2 shadow-sm backdrop-blur", className)}>
      <div className="overflow-hidden rounded-lg border bg-background/60">
        <WindowTopbar title="MotorGestor • Pipeline" />
        <div className="grid min-h-[360px] grid-cols-12">
          <div className="col-span-3 border-r bg-background/50 p-4">
            <div className="h-8 rounded-lg bg-foreground/8" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-foreground/6" />
              ))}
            </div>
          </div>
          <div className="col-span-9 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-foreground/10" />
                <div className="h-3 w-72 rounded bg-foreground/8" />
              </div>
              <div className="h-9 w-32 rounded-lg bg-foreground/10" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {["Novo", "Contato", "Negociação", "Fechado"].map((col, idx) => (
                <div key={col} className="rounded-xl border bg-background/70 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {col}
                    </div>
                    <div className="h-2 w-6 rounded bg-foreground/10" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className={cn("h-12 rounded-lg", idx === 2 ? "bg-foreground/10" : "bg-foreground/6")} />
                    <div className="h-12 rounded-lg bg-foreground/6" />
                    {idx === 0 ? <div className="h-12 rounded-lg bg-foreground/6" /> : null}
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

export function LeadTimelineScreenshot({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden rounded-xl border bg-background/40 p-2 shadow-sm backdrop-blur", className)}>
      <div className="overflow-hidden rounded-lg border bg-background/60">
        <WindowTopbar title="MotorGestor • Lead • Timeline" />
        <div className="grid min-h-[360px] grid-cols-12">
          <div className="col-span-4 border-r bg-background/50 p-4">
            <div className="h-4 w-44 rounded bg-foreground/10" />
            <div className="mt-2 h-3 w-56 rounded bg-foreground/8" />
            <div className="mt-6 rounded-xl border bg-background/70 p-3">
              <div className="h-3 w-28 rounded bg-foreground/8" />
              <div className="mt-3 h-9 rounded-lg bg-foreground/6" />
              <div className="mt-2 h-9 rounded-lg bg-foreground/6" />
            </div>
          </div>
          <div className="col-span-8 p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded bg-foreground/10" />
              <div className="h-8 w-28 rounded-lg bg-foreground/10" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["WhatsApp", "bg-emerald-400/15"],
                ["Mudança de status", "bg-blue-500/10"],
                ["Comentário", "bg-foreground/6"],
              ].map(([label, bg], i) => (
                <div key={i} className="rounded-xl border bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("size-7 rounded-lg border", bg)} />
                      <div className="text-sm font-medium">{label}</div>
                    </div>
                    <div className="h-2 w-20 rounded bg-foreground/10" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-[88%] rounded bg-foreground/8" />
                    <div className="h-3 w-[74%] rounded bg-foreground/8" />
                    <div className="h-3 w-[60%] rounded bg-foreground/8" />
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

export function AgendaScreenshot({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden rounded-xl border bg-background/40 p-2 shadow-sm backdrop-blur", className)}>
      <div className="overflow-hidden rounded-lg border bg-background/60">
        <WindowTopbar title="MotorGestor • Agenda" />
        <div className="grid min-h-[360px] grid-cols-12">
          <div className="col-span-8 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-foreground/10" />
                <div className="h-3 w-72 rounded bg-foreground/8" />
              </div>
              <div className="h-9 w-28 rounded-lg bg-foreground/10" />
            </div>
            <div className="mt-4 rounded-xl border bg-background/70 p-3">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={cn("h-10 rounded-lg", i % 9 === 0 ? "bg-emerald-400/15" : "bg-foreground/6")} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-4 border-l bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-foreground/8" />
              <div className="h-2 w-6 rounded bg-foreground/10" />
            </div>
            <div className="mt-3 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-background/70 p-3">
                  <div className="h-3 w-[80%] rounded bg-foreground/8" />
                  <div className="mt-2 h-2 w-24 rounded bg-foreground/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

