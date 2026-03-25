"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { type ReactNode } from "react";

// Cast to any to bypass react-lenis using @types/react@18 while project uses React 19
const LenisRoot = ReactLenis as React.ComponentType<{
  root?: boolean;
  options?: { lerp?: number; duration?: number; smoothWheel?: boolean };
  children?: ReactNode;
}>;

import React from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <LenisRoot root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </LenisRoot>
  );
}
