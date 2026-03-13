"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/components/app/app-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.sidebarOpen);
  const setOpen = useUiStore((s) => s.setSidebarOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-80 border-white/10 bg-black/85 p-0 text-white backdrop-blur-xl">
        <SheetHeader className="border-b border-white/10 p-5">
          <SheetTitle className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]" />
            <span className="tracking-tight">MotorGestor</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1.5 p-4">
          {appNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
                    : "text-white/70 hover:bg-white/6 hover:text-white",
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
      </SheetContent>
    </Sheet>
  );
}

