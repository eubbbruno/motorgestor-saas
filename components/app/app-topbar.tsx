"use client";

import Link from "next/link";
import { BellIcon, CarIcon, ChevronDownIcon, MenuIcon, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { useUiStore } from "@/lib/stores/ui-store";
import { useDashboardMetrics } from "@/features/dashboard/hooks";
import { NAV_FLAT } from "@/components/app/nav-groups";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/app/global-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppTopbar({
  name,
  email,
  roleLabel,
}: {
  name?: string | null;
  email?: string | null;
  roleLabel?: string;
}) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const pathname = usePathname();
  const metrics = useDashboardMetrics();

  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "MG";

  const current = NAV_FLAT.find(
    (i) => pathname === i.href || (i.href !== "/app" && pathname.startsWith(i.href)),
  );

  const totalLeads = metrics.data?.total_leads ?? 0;
  const conversion = metrics.data
    ? Math.round((metrics.data.taxa_conversao ?? 0) * 100)
    : null;

  return (
    <div className="flex h-16 items-center border-b border-[rgba(74,229,74,0.08)] bg-[#0A1A0C]">

      {/* ── Mobile layout (hidden on lg+) ───────────────────────────────────── */}
      <div className="flex w-full items-center justify-between px-4 lg:hidden">
        {/* Left: hamburger */}
        <Button
          size="icon"
          variant="ghost"
          className="text-[#6B9E6B] hover:text-white hover:bg-[rgba(74,229,74,0.08)] shrink-0"
          onClick={toggleSidebar}
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-5" />
        </Button>

        {/* Center: logo */}
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-[#4AE54A] flex items-center justify-center shrink-0">
            <CarIcon className="size-3.5 text-[#0A1A0C]" />
          </div>
          <span className="font-bold tracking-tight text-white text-sm">MotorGestor</span>
        </div>

        {/* Right: avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center rounded-xl hover:bg-[rgba(74,229,74,0.06)] p-1 transition-colors">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-[#4AE54A] text-[#0A1A0C] text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-52 border-[rgba(74,229,74,0.12)] bg-[#0A1A0C] text-white"
          >
            <div className="px-2 py-1.5 text-sm">
              <div className="font-semibold text-white">{name ?? "Usuário"}</div>
              <div className="text-xs text-[#6B9E6B]">{email ?? ""}</div>
              {roleLabel && <div className="mt-0.5 text-xs text-[#6B9E6B]">{roleLabel}</div>}
            </div>
            <DropdownMenuSeparator className="bg-[rgba(74,229,74,0.08)]" />
            <DropdownMenuItem asChild>
              <Link href="/app/configuracoes" className="text-[#6B9E6B] hover:text-white">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(74,229,74,0.08)]" />
            <DropdownMenuItem asChild>
              <Link href="/logout" className="text-red-400 hover:text-red-300">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Desktop layout (hidden below lg) ────────────────────────────────── */}
      <div className="hidden lg:flex w-full items-center justify-between px-6">
        {/* Left: avatar dropdown + page label */}
        <div className="flex items-center gap-3 min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-xl hover:bg-[rgba(74,229,74,0.06)] px-2 py-1.5 transition-colors min-w-0">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-[#4AE54A] text-[#0A1A0C] text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left min-w-0">
                  <div className="text-sm font-semibold text-white truncate leading-tight">
                    {name ?? "Conta"}
                  </div>
                  <div className="text-[10px] text-[#6B9E6B] truncate leading-tight">
                    {roleLabel || "MotorGestor"}
                  </div>
                </div>
                <ChevronDownIcon className="size-3.5 text-[#6B9E6B] shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-56 border-[rgba(74,229,74,0.12)] bg-[#0A1A0C] text-white"
            >
              <div className="px-2 py-1.5 text-sm">
                <div className="font-semibold text-white">{name ?? "Usuário"}</div>
                <div className="text-xs text-[#6B9E6B]">{email ?? ""}</div>
                {roleLabel && <div className="mt-0.5 text-xs text-[#6B9E6B]">{roleLabel}</div>}
              </div>
              <DropdownMenuSeparator className="bg-[rgba(74,229,74,0.08)]" />
              <DropdownMenuItem asChild>
                <Link href="/app/configuracoes" className="text-[#6B9E6B] hover:text-white">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/ajuda" className="text-[#6B9E6B] hover:text-white">Ajuda</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(74,229,74,0.08)]" />
              <DropdownMenuItem asChild>
                <Link href="/logout" className="text-red-400 hover:text-red-300">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-sm text-[#6B9E6B] pl-1">
            {current?.label ?? "Painel"}
          </div>
        </div>

        {/* Center: quick metrics */}
        <div className="flex items-center gap-3">
          {!metrics.isLoading && (
            <>
              <div className="flex items-center gap-1.5 rounded-full border border-[rgba(74,229,74,0.15)] bg-[rgba(74,229,74,0.06)] px-3 py-1">
                <span className="text-xs text-[#6B9E6B]">Leads:</span>
                <span className="text-xs font-bold text-[#4AE54A]">{totalLeads}</span>
              </div>
              {conversion !== null && (
                <div className="flex items-center gap-1.5 rounded-full border border-[rgba(74,229,74,0.15)] bg-[rgba(74,229,74,0.06)] px-3 py-1">
                  <span className="text-xs text-[#6B9E6B]">Conversão:</span>
                  <span className="text-xs font-bold text-[#4AE54A]">{conversion}%</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: search + notifications + CTA */}
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <button className="relative p-2 text-[#6B9E6B] hover:text-white hover:bg-[rgba(74,229,74,0.08)] rounded-lg transition-colors">
            <BellIcon className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#4AE54A]" />
          </button>
          <Button
            asChild
            size="sm"
            className="bg-[#4AE54A] text-[#0A1A0C] hover:bg-[#3dd13d] font-bold shadow-[0_0_12px_rgba(74,229,74,0.3)]"
          >
            <Link href="/app/veiculos/novo">
              <PlusIcon className="size-3.5 mr-1.5" />
              Adicionar Veículo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
