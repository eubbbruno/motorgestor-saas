"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/components/app/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 flex-col border-r bg-background/60 backdrop-blur lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.15)]" />
        <span className="font-semibold tracking-tight">MotorGestor</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
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
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                active && "bg-accent text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Dica rápida</div>
        <div className="mt-1">
          Cadastre seus veículos primeiro e depois conecte os leads a eles.
        </div>
      </div>
    </aside>
  );
}

