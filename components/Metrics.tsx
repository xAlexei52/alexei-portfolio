"use client";

import { METRICS } from "@/lib/content";
import { useCountUp } from "@/hooks/useCountUp";

export default function Metrics() {
  const { containerRef, values } = useCountUp(METRICS.map((m) => m.target));

  return (
    <section
      className="metrics"
      ref={containerRef as React.RefObject<HTMLElement>}
      aria-label="Cifras destacadas"
    >
      {METRICS.map((metric, index) => (
        <div className="metric" key={metric.label}>
          <span className="metric__value">
            {values[index].toFixed(metric.decimals)}
            {metric.suffix}
          </span>
          <span className="metric__label">{metric.label}</span>
        </div>
      ))}
    </section>
  );
}
