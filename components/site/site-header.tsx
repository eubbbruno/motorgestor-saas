"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { href: "/", label: "Início" },
  { href: "/recursos", label: "Funcionalidades" },
  { href: "/planos", label: "Preços" },
  { href: "/blog", label: "Blog" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative group text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium py-0.5"
    >
      {label}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#4AE54A] transition-all duration-300 group-hover:w-full rounded-full" />
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 bg-[#0A1A0C] border-b border-[#4AE54A]/10 transition-all duration-300",
        scrolled ? "bg-[#0A1A0C]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo-motorgestor-new.svg"
            alt="MotorGestor"
            width={240}
            height={48}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold rounded-lg border border-[#4AE54A]/50 text-white hover:bg-[#4AE54A]/10 transition-all duration-200"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="group flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-[#4AE54A] text-black hover:bg-[#4AE54A]/90 shadow-[0_0_16px_rgba(74,229,74,0.35)] hover:shadow-[0_0_24px_rgba(74,229,74,0.5)] transition-all duration-200"
          >
            Começar grátis
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile toggle — shadcn Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
              aria-label="Abrir menu"
            >
              <MenuIcon className="size-5" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 bg-[#0D1F1A] border-l border-[rgba(74,229,74,0.12)] p-0 flex flex-col"
          >
            {/* Logo */}
            <div className="p-5 border-b border-[rgba(74,229,74,0.08)]">
              <Image
                src="/images/logo-motorgestor-new.svg"
                alt="MotorGestor"
                width={180}
                height={36}
                className="h-9 w-auto"
                unoptimized
              />
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-5 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-[rgba(74,229,74,0.06)] rounded-xl transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTAs */}
            <div className="p-5 space-y-2 border-t border-[rgba(74,229,74,0.08)]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-2.5 text-sm font-semibold rounded-xl border border-[#4AE54A]/50 text-white hover:bg-[#4AE54A]/10 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-xl bg-[#4AE54A] text-black hover:bg-[#4AE54A]/90 transition-colors shadow-[0_0_16px_rgba(74,229,74,0.35)]"
              >
                Começar grátis <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
