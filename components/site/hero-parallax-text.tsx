"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// Wraps hero text — drifts up slightly and fades as user scrolls
export function HeroTextMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.4], ["0%", "-8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.3]);

  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
