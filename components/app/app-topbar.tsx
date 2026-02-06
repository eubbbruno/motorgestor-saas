"use client";

import Link from "next/link";
import { ChevronDownIcon, MenuIcon } from "lucide-react";

import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "MG";

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background/60 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Painel</span>{" "}
          <span className="hidden sm:inline">— MotorGestor</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Avatar className="size-6">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{name ?? "Conta"}</span>
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-64">
          <div className="px-2 py-1.5 text-sm">
            <div className="font-medium">{name ?? "Usuário"}</div>
            <div className="text-xs text-muted-foreground">{email ?? ""}</div>
            {roleLabel ? (
              <div className="mt-1 text-xs text-muted-foreground">{roleLabel}</div>
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

