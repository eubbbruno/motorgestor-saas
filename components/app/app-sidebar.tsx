"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/components/app/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
      <div className="relative h-full border-r border-white/10 bg-[#07080b]/85 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.22),transparent_60%)] blur-3xl" />
          <div className="absolute -bottom-52 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.22),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-white">MotorGestor</div>
            <div className="text-[11px] text-white/55">Operação e funil em um só lugar</div>
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15",
                  active
                    ? "bg-white/10 text-white shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-emerald-400 before:shadow-[0_0_0_6px_rgba(52,211,153,.12),0_0_30px_rgba(52,211,153,.35)]"
                    : "text-white/70 hover:bg-white/8 hover:text-white hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:h-6 hover:before:w-1 hover:before:-translate-y-1/2 hover:before:rounded-full hover:before:bg-white/20",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-opacity",
                    active ? "opacity-100" : "opacity-70 group-hover:opacity-95",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-white/10 px-6 py-5 text-xs text-white/60">
          <div className="font-medium text-white/85">Dica rápida</div>
          <div className="mt-1">
            Cadastre seus veículos primeiro e depois conecte os leads a eles.
          </div>
        </div>
      </div>
    </aside>
  );
}

