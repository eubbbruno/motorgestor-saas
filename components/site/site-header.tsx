"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon, MenuIcon, ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/site/container";

const nav = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/recursos", label: "Features" },
  { href: "/planos", label: "Preços" },
  { href: "/blog", label: "Blog" },
];

// ─── Animated nav link ────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="relative group text-[#9CA3AF] hover:text-white transition-colors duration-200 text-sm font-medium py-0.5">
      {label}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#4AE54A] transition-all duration-300 group-hover:w-full rounded-full" />
    </Link>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0D1F1A]/98 backdrop-blur-md border-b border-[rgba(74,229,74,0.12)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-[#0D1F1A]/80 backdrop-blur-sm border-b border-transparent",
      ].join(" ")}
    >
      <Container className="flex h-16 items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo-motorgestor-branco-e-verde.svg"
            alt="MotorGestor"
            width={180}
            height={36}
            className="h-9 w-auto"
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
            className="px-4 py-1.5 text-sm font-semibold rounded-lg border border-[rgba(74,229,74,0.25)] text-[#4AE54A] hover:bg-[rgba(74,229,74,0.08)] transition-all duration-200"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="group flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-lg bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] shadow-[0_0_16px_rgba(74,229,74,0.35)] hover:shadow-[0_0_24px_rgba(74,229,74,0.5)] transition-all duration-200"
          >
            Começar Grátis
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden relative z-50 p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <XIcon className="size-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MenuIcon className="size-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </Container>

      {/* Mobile menu — slide-in drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 z-50 w-72 bg-[#0D1F1A] border-l border-[rgba(74,229,74,0.12)] shadow-2xl md:hidden flex flex-col"
            >
              <nav className="flex-1 p-5 space-y-1">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[rgba(74,229,74,0.06)] rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-5 space-y-2 border-t border-[rgba(74,229,74,0.08)]">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 text-sm font-semibold rounded-xl border border-[rgba(74,229,74,0.25)] text-[#4AE54A] hover:bg-[rgba(74,229,74,0.08)] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold rounded-xl bg-[#4AE54A] text-[#0D1F1A] hover:bg-[#3dd13d] transition-colors shadow-[0_0_16px_rgba(74,229,74,0.35)]"
                >
                  Começar Grátis <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
