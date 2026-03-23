"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/components/app/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
      <div className="relative h-full border-r border-mg-border bg-mg-bg/55 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--mg-glow-emerald)_100%,transparent),transparent_60%)] blur-3xl" />
          <div className="absolute -bottom-52 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--mg-glow-blue)_100%,transparent),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative flex h-16 items-center gap-3 border-b border-mg-border px-6">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-foreground">MotorGestor</div>
            <div className="text-[11px] text-mg-fg-muted">Operação e funil em um só lugar</div>
          </div>
        </div>

        <nav className="relative flex-1 space-y-1.5 p-4">
          {appNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition",
                  "motion-safe:transition-[transform,background-color,box-shadow] motion-safe:duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15",
                  active
                    ? "bg-mg-surface-2 text-foreground shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_50px_rgba(0,0,0,0.35)] before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-emerald-400 before:shadow-[0_0_0_6px_rgba(52,211,153,.12),0_0_30px_rgba(52,211,153,.30)] motion-safe:translate-x-[2px]"
                    : "text-mg-fg-muted hover:bg-mg-surface hover:text-foreground hover:shadow-[0_14px_36px_rgba(0,0,0,0.20)] motion-safe:hover:translate-x-[2px] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:h-6 hover:before:w-1 hover:before:-translate-y-1/2 hover:before:rounded-full hover:before:bg-emerald-400/25 hover:before:shadow-[0_0_22px_rgba(52,211,153,0.18)]",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] transition-opacity",
                    active
                      ? "opacity-100 drop-shadow-[0_0_18px_rgba(52,211,153,0.25)]"
                      : "opacity-75 group-hover:opacity-95",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-mg-border px-6 py-5 text-xs text-mg-fg-muted">
          <div className="font-medium text-foreground/85">Dica rápida</div>
          <div className="mt-1">
            Cadastre seus veículos primeiro e depois conecte os leads a eles.
          </div>
        </div>
      </div>
    </aside>
  );
}

