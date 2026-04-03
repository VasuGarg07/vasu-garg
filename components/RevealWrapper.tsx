"use client";
import { useReveal } from "@/hooks/useReveal";

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
  useReveal();  // sets up IntersectionObserver on all .section-reveal elements
  return <>{children}</>;
}