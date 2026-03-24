"use client";

import Link from "next/link";
import { useState } from "react";
import { CarIcon, MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recursos", label: "Features" },
  { href: "/planos", label: "Preços" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0D1F1A]/95 backdrop-blur-md border-b border-[rgba(74,229,74,0.1)]">
      <Container className="flex h-16 items-center justify-between relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white text-base tracking-tight shrink-0"
        >
          <div className="size-7 rounded-lg bg-[#4AE54A] flex items-center justify-center">
            <CarIcon className="size-4 text-[#0D1F1A]" />
          </div>
          MotorGestor
        </Link>

        {/* Desktop nav — centered absolutely */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[#9CA3AF] hover:text-white hover:bg-white/5"
          >
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-semibold shadow-[0_0_14px_rgba(74,229,74,0.35)]"
          >
            <Link href="/cadastro">Começar agora</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0D1F1A] border-t border-[rgba(74,229,74,0.1)] px-4 pb-5">
          <nav className="space-y-1 pt-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 text-white bg-white/5 hover:bg-white/10"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] font-semibold"
            >
              <Link href="/cadastro" onClick={() => setOpen(false)}>
                Começar agora
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
