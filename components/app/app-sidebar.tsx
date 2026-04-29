"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  BotIcon,
  CalendarIcon,
  CarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  PlugIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/app",          label: "Dashboard",   icon: LayoutDashboardIcon },
      { href: "/app/veiculos", label: "Veículos",    icon: CarIcon },
      { href: "/app/leads",    label: "Leads",       icon: UsersIcon },
      { href: "/app/agenda",   label: "Agenda",      icon: CalendarIcon },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { href: "/app/relatorios",  label: "Relatórios",    icon: BarChart3Icon },
      { href: "/app/assistente",  label: "Assistente IA", icon: BotIcon },
      { href: "/app/whatsapp",    label: "WhatsApp",      icon: MessageCircleIcon },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/app/integracoes",   label: "Integrações",      icon: PlugIcon },
      { href: "/app/billing",       label: "Plano & Cobrança", icon: CreditCardIcon },
      { href: "/app/configuracoes", label: "Configurações",    icon: SettingsIcon },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
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
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-[#4AE54A] text-[#0A1A0C] font-semibold"
                          : "text-[#6B9E6B] hover:bg-[rgba(74,229,74,0.08)] hover:text-white",
                      )}
                    >
                      <Icon className={cn("size-[17px] shrink-0", active ? "text-[#0A1A0C]" : "text-[#6B9E6B]")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[rgba(74,229,74,0.08)] px-5 py-3">
          <div className="text-[10px] text-[#6B9E6B]/60">
            Cadastre veículos primeiro, depois conecte os leads.
          </div>
        </div>
      </div>
    </aside>
  );
}
