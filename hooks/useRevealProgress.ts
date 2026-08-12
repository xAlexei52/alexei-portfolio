"use client";

import { useEffect, useRef } from "react";

/**
 * Writes how far the page is through its final viewport into `--reveal` on the
 * given element, from 0 to 1. Drives the footer parallax without a scroll
 * library, and without a React render per frame.
 */
export function useRevealProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--reveal", "1");
      return;
    }

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const remaining = scrollable - window.scrollY;
      const progress = 1 - Math.min(1, Math.max(0, remaining / window.innerHeight));
      node.style.setProperty("--reveal", progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}
