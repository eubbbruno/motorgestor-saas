"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  CalendarIcon,
  CarIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LinkIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/app/veiculos", label: "Veículos", icon: CarIcon },
  { href: "/app/leads", label: "Leads", icon: UsersIcon },
  { href: "/app/pipeline", label: "Pipeline", icon: LayoutGridIcon },
  { href: "/app/agenda", label: "Agenda", icon: CalendarIcon },
  { href: "/app/relatorios", label: "Relatórios", icon: BarChart3Icon },
  { href: "/app/integracoes", label: "Integrações", icon: LinkIcon },
  { href: "/app/billing", label: "Plano & Cobrança", icon: CreditCardIcon },
  { href: "/app/configuracoes", label: "Configurações", icon: SettingsIcon },
  { href: "/app/ajuda", label: "Ajuda", icon: HelpCircleIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
      <div className="flex h-full flex-col bg-[#0A1A0C] border-r border-[rgba(74,229,74,0.1)]">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-[rgba(74,229,74,0.08)]">
          <div className="size-8 rounded-xl bg-[#4AE54A] flex items-center justify-center shrink-0">
            <CarIcon className="size-4 text-[#0A1A0C]" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-white text-sm">MotorGestor</div>
            <div className="text-[10px] text-[#6B9E6B]">Operação e funil em um só lugar</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
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

        {/* Footer */}
        <div className="border-t border-[rgba(74,229,74,0.08)] px-5 py-4">
          <div className="text-[11px] text-[#6B9E6B]">
            Cadastre veículos primeiro, depois conecte os leads.
          </div>
        </div>
      </div>
    </aside>
  );
}
