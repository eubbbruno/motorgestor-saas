"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Single observer on the container — all stats fire together
function useContainerVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return count;
}

const stats = [
  { target: 50,   suffix: "K+",   label: "Usuários ativos",  duration: 1600, delay: 0   },
  { target: 2800, suffix: "+",    label: "Veículos vendidos", duration: 2000, delay: 120 },
  { target: 23,   suffix: "%",    label: "Conversão média",   duration: 1400, delay: 240 },
  { target: 10,   suffix: " min", label: "Setup completo",    duration: 1000, delay: 360 },
];

function StatItem({ stat, trigger }: { stat: typeof stats[number]; trigger: boolean }) {
  const count = useCountUp(stat.target, stat.duration, trigger);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={trigger
        ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, delay: stat.delay / 1000, ease: [0.22, 1, 0.36, 1] } }
        : { opacity: 0, y: 18, filter: "blur(6px)" }
      }
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {count.toLocaleString("pt-BR")}{stat.suffix}
      </div>
      <div className="text-sm text-[#6B9E6B] mt-1 font-medium">{stat.label}</div>
    </motion.div>
  );
}

export function AnimatedStats() {
  const { ref, visible } = useContainerVisible();
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 py-10 px-6 rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.4)] to-transparent" />
      {stats.map((s) => (
        <StatItem key={s.label} stat={s} trigger={visible} />
      ))}
    </div>
  );
}
