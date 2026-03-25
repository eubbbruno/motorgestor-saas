"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2.5} suffix={suffix} /> : "0"}
    </span>
  );
}
