"use client";

import { useEffect, useRef, useState } from "react";

const BASE_DURATION = 1500;
const DURATION_STEP = 80;
const BASE_DELAY = 480;
const DELAY_STEP = 90;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts each target up from zero once its container scrolls into view.
 * Each entry is staggered: it starts at `480 + i * 90`ms and runs for
 * `1500 + i * 80`ms on an easeOutCubic curve.
 */
export function useCountUp(targets: number[]) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<number[]>(() => targets.map(() => 0));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const frames: number[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (prefersReducedMotion()) {
        setValues(targets);
        return;
      }

      targets.forEach((target, index) => {
        const duration = BASE_DURATION + index * DURATION_STEP;
        const delay = BASE_DELAY + index * DELAY_STEP;

        timers.push(
          setTimeout(() => {
            const start = performance.now();

            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const value = target * easeOutCubic(progress);

              setValues((prev) => {
                const next = [...prev];
                next[index] = progress === 1 ? target : value;
                return next;
              });

              if (progress < 1) frames.push(requestAnimationFrame(step));
            };

            frames.push(requestAnimationFrame(step));
          }, delay),
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, values };
}
