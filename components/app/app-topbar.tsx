"use client";

import Link from "next/link";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/app/global-search";
import { appNav } from "@/components/app/app-nav";
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

  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "MG";

  const current = appNav.find((i) => pathname === i.href || (i.href !== "/app" && pathname.startsWith(i.href)));

  return (
    <div className="flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-4 text-white backdrop-blur-lg lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-4" />
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.10)] sm:inline-block" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">
              {current?.label ?? "Painel"}
            </div>
            <div className="hidden truncate text-xs text-white/55 sm:block">
              MotorGestor · {roleLabel || "Conta"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-3 hidden min-w-0 flex-1 items-center justify-center md:flex">
        <div className="w-full max-w-xl">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <GlobalSearch />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Avatar className="size-6">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{name ?? "Conta"}</span>
            <ChevronDownIcon className="size-4 text-white/60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-64 border-white/10 bg-black/80 text-white backdrop-blur">
          <div className="px-2 py-1.5 text-sm">
            <div className="font-medium">{name ?? "Usuário"}</div>
            <div className="text-xs text-white/60">{email ?? ""}</div>
            {roleLabel ? (
              <div className="mt-1 text-xs text-white/60">{roleLabel}</div>
            ) : null}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/app/configuracoes">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/app/ajuda">Ajuda</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout">Sair</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

