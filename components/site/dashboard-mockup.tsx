import * as React from "react";
import { cn } from "@/lib/utils";

function Sparkline() {
  return (
    <svg viewBox="0 0 180 60" className="h-full w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4AE54A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4AE54A" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d="M0,46 C20,44 24,18 44,22 C62,26 62,44 80,38 C98,32 104,10 124,16 C146,22 146,40 180,26 L180,60 L0,60 Z"
        fill="url(#spark)"
      />
      <path
        d="M0,46 C20,44 24,18 44,22 C62,26 62,44 80,38 C98,32 104,10 124,16 C146,22 146,40 180,26"
        fill="none"
        stroke="#4AE54A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniBars() {
  const heights = [24, 34, 18, 46, 30, 52, 40, 58];
  return (
    <div className="grid h-full w-full grid-cols-8 items-end gap-1">
      {heights.map((h, idx) => (
        <div
          key={idx}
          className={idx >= 5 ? "rounded-sm bg-[#4AE54A]" : "rounded-sm bg-[#4AE54A]/30"}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#4AE54A]/15 bg-[#0F2014]/40 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-[#4AE54A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 -bottom-28 size-80 rounded-full bg-[#4AE54A]/5 blur-3xl" />

      <div className="relative overflow-hidden rounded-lg border border-[#4AE54A]/10 bg-[#0D1F1A]/60">
        {/* Browser bar */}
        <div className="flex items-center justify-between border-b border-[#4AE54A]/10 bg-[#0D1F1A]/70 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/10" />
          </div>
          <div className="text-xs font-medium text-[#6B9E6B]">MotorGestor • Dashboard</div>
          <div className="h-2 w-16 rounded-full bg-white/10" />
        </div>

        <div className="grid min-h-[280px] grid-cols-12 sm:min-h-[360px]">
          {/* Sidebar */}
          <div className="col-span-4 border-r border-[#4AE54A]/10 bg-[#0A1A0C] p-4 sm:col-span-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#4AE54A]/80" />
              <div className="h-3 w-24 rounded bg-white/10" />
            </div>
            <div className="mt-4 space-y-1.5">
              {["Dashboard", "Veículos", "Leads", "Pipeline", "Agenda"].map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "h-8 rounded-lg px-3",
                    i === 0 ? "bg-[#4AE54A]" : "bg-white/5",
                  )}
                >
                  <div className="flex h-full items-center gap-2">
                    <div className={cn("size-3 rounded", i === 0 ? "bg-black/20" : "bg-white/10")} />
                    <div className={cn("h-3 w-20 rounded", i === 0 ? "bg-black/20" : "bg-white/10")} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-[#4AE54A]/15 bg-[#0D1F1A] p-3">
              <div className="text-[11px] text-[#6B9E6B]">Meta do mês</div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div className="h-2 w-[62%] rounded-full bg-[#4AE54A]" />
              </div>
              <div className="mt-2 text-xs font-medium text-white">62%</div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-8 p-4 sm:col-span-9">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="h-3 w-56 rounded bg-white/8" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 rounded-lg border border-[#4AE54A]/15 bg-[#0D1F1A]/70" />
                <div className="h-9 w-28 rounded-lg bg-[#4AE54A]/10" />
              </div>
            </div>

            {/* KPI cards */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Total leads", "128"],
                ["Em negociação", "19"],
                ["Fechados", "7"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#4AE54A]/20 bg-[#0F2014] p-3">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B9E6B]">
                    {label}
                  </div>
                  <div className="mt-1 text-xl font-bold text-white tracking-tight">{value}</div>
                  <div className="mt-2 h-2 w-20 rounded bg-white/10" />
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="mt-3 grid gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-[#4AE54A]/15 bg-[#0F2014] p-3 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B9E6B]">
                    Evolução (6 meses)
                  </div>
                  <div className="h-2 w-12 rounded bg-white/10" />
                </div>
                <div className="mt-3 h-24">
                  <Sparkline />
                </div>
              </div>
              <div className="rounded-xl border border-[#4AE54A]/15 bg-[#0F2014] p-3 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B9E6B]">
                    Funil (agora)
                  </div>
                  <div className="h-2 w-12 rounded bg-white/10" />
                </div>
                <div className="mt-3 h-24">
                  <MiniBars />
                </div>
              </div>
            </div>

            {/* Pipeline columns */}
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {["Novo", "Negociação", "Fechado"].map((t) => (
                <div key={t} className="rounded-xl border border-[#4AE54A]/15 bg-[#0F2014] p-3">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B9E6B]">{t}</div>
                  <div className="mt-2 space-y-2">
                    <div className="h-10 rounded-lg bg-white/5" />
                    <div className="h-10 rounded-lg bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
