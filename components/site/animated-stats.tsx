"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, ref };
}

const stats = [
  { target: 50, suffix: "K+", label: "Usuários ativos", prefix: "" },
  { target: 2800, suffix: "+", label: "Veículos vendidos", prefix: "" },
  { target: 23, suffix: "%", label: "Conversão média", prefix: "" },
  { target: 10, suffix: " min", label: "Setup completo", prefix: "" },
];

function StatItem({ stat }: { stat: typeof stats[number] }) {
  const { count, ref } = useCountUp(stat.target);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {stat.prefix}{count.toLocaleString("pt-BR")}{stat.suffix}
      </div>
      <div className="text-sm text-[#6B9E6B] mt-1 font-medium">{stat.label}</div>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 py-10 px-6 rounded-2xl border border-[rgba(74,229,74,0.12)] bg-[#0F2014] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(74,229,74,0.4)] to-transparent" />
      {stats.map((s) => (
        <StatItem key={s.label} stat={s} />
      ))}
    </div>
  );
}
