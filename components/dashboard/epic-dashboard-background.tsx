"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function EpicDashboardBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]",
        className,
      )}
      aria-hidden="true"
    >
      {/* Glow orbs */}
      <motion.div
        className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.35),transparent_60%)] blur-2xl"
        animate={{ x: [0, 40, -10, 0], y: [0, 25, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-48 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.35),transparent_60%)] blur-2xl"
        animate={{ x: [0, -35, 10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.22),transparent_60%)] blur-3xl"
        animate={{ x: [0, -20, 10, 0], y: [0, 10, -18, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.22]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_30%,transparent_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.9)_100%)]" />
      </div>

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

