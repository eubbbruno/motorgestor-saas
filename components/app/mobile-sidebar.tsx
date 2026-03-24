"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarIcon } from "lucide-react";

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
      <SheetContent
        side="left"
        className="w-72 border-r border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] p-0 text-white"
      >
        <SheetHeader className="border-b border-[rgba(74,229,74,0.08)] p-4">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="size-7 rounded-xl bg-[#4AE54A] flex items-center justify-center">
              <CarIcon className="size-4 text-[#0A1A0C]" />
            </div>
            <span className="font-bold tracking-tight text-white">MotorGestor</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-4">
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
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-[#4AE54A] text-[#0A1A0C] font-semibold"
                    : "text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] shrink-0",
                    active ? "text-[#0A1A0C]" : "text-[#6B9E6B]",
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
