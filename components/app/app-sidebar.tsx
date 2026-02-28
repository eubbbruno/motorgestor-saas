"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/components/app/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-72 flex-col border-r bg-background/40 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]" />
        <div className="leading-tight">
          <div className="font-semibold tracking-tight">MotorGestor</div>
          <div className="text-[11px] text-muted-foreground">Operação e funil em um só lugar</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
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
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                active
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4 transition-opacity", active ? "opacity-100" : "opacity-65 group-hover:opacity-90")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-6 py-5 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Dica rápida</div>
        <div className="mt-1">
          Cadastre seus veículos primeiro e depois conecte os leads a eles.
        </div>
      </div>
    </aside>
  );
}

