"use client";

import { STATS } from "@/lib/content";
import { useCountUp } from "@/hooks/useCountUp";

const STAGGER = ["0.5s", "0.58s", "0.66s", "0.74s"];

export default function StatsFooter() {
  const { containerRef, values } = useCountUp(STATS.map((stat) => stat.target));

  return (
    <section
      className="stats"
      ref={containerRef as React.RefObject<HTMLElement>}
      aria-label="Platform metrics"
    >
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className="stat anim"
          style={{ ["--d" as string]: STAGGER[index] }}
        >
          <span className="stat__icon" aria-hidden="true">
            {stat.icon}
          </span>
          <span className="stat__value">
            {values[index].toFixed(stat.decimals)}
            {stat.suffix}
          </span>
          <span className="stat__label">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
