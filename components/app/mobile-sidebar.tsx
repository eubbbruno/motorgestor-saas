"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarIcon } from "lucide-react";

import { NAV_GROUPS } from "@/components/app/nav-groups";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.sidebarOpen);
  const setOpen = useUiStore((s) => s.setSidebarOpen);

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    if (href === "/app/whatsapp") return pathname === "/app/whatsapp";
    return pathname.startsWith(href);
  }

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-72 border-r border-[rgba(74,229,74,0.1)] bg-[#0A1A0C] p-0 text-white"
      >
        <SheetHeader className="border-b border-[rgba(74,229,74,0.08)] px-5 h-16 flex flex-row items-center space-y-0">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#4AE54A] flex items-center justify-center shrink-0">
              <CarIcon className="size-4 text-[#0A1A0C]" />
            </div>
            <div>
              <div className="font-bold tracking-tight text-white text-sm">MotorGestor</div>
              <div className="text-[10px] text-[#6B9E6B]">Operação e funil em um só lugar</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-widest text-[#6B9E6B]/50">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-[#4AE54A] text-[#0A1A0C] font-semibold"
                            : "text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white",
                        )}
                      >
                        <Icon className={cn("size-[18px] shrink-0", active ? "text-[#0A1A0C]" : "text-[#6B9E6B]")} />
                        <span>{item.label}</span>
                      </Link>

                      {/* Sub-items — always visible on mobile so user can navigate easily */}
                      {item.subItems && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[rgba(74,229,74,0.1)] pl-3">
                          {item.subItems.map((sub) => {
                            const subActive = isActive(sub.href);
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={close}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors",
                                  subActive
                                    ? "bg-[rgba(74,229,74,0.15)] text-[#4AE54A] font-semibold"
                                    : "text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.06)] hover:text-white",
                                )}
                              >
                                <SubIcon className={cn("size-3.5 shrink-0", subActive ? "text-[#4AE54A]" : "text-[#6B9E6B]")} />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[rgba(74,229,74,0.08)] px-5 py-3">
          <div className="text-[10px] text-[#6B9E6B]/60">
            Cadastre veículos primeiro, depois conecte os leads.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
