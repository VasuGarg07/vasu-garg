"use client";
import { useEffect } from "react";

export function useReveal(
  revealClass = "p-reveal",
  visibleClass = "p-visible"
) {
  useEffect(() => {
    // Small delay ensures DOM is fully painted
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(`.${revealClass}`);

      if (!els.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add(visibleClass);
              }, i * 70);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );

      els.forEach((el) => io.observe(el));

      // Cleanup
      return () => io.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [revealClass, visibleClass]);
}