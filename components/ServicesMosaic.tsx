"use client";

import { useEffect, useRef, useState } from "react";

import { SERVICES } from "@/lib/content";
import { useMosaicCorners } from "@/hooks/useMosaicCorners";
import ServiceCard from "./ServiceCard";
import Reveal from "./Reveal";

/**
 * Client boundary for the mosaic. Owns which card is expanded: clicking one
 * makes it take over the whole grid area while the rest fade out.
 */
export default function ServicesMosaic() {
  const ref = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  useMosaicCorners(ref);

  /* Escape closes, matching every other dismissable overlay on the page. */
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  /* Pin the grid's height while a card is expanded. The open card is taken out
     of flow, so without this the section would collapse and the page would
     jump under the reader. */
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    if (openId) {
      grid.style.minHeight = `${grid.getBoundingClientRect().height}px`;
    } else {
      grid.style.minHeight = "";
    }
  }, [openId]);

  return (
    <div
      className="mosaic"
      ref={ref}
      data-has-open={openId ? "true" : undefined}
      /* Clicking the backdrop around an expanded card closes it. */
      onClick={(event) => {
        if (openId && event.target === event.currentTarget) setOpenId(null);
      }}
    >
      {SERVICES.map((service, index) => (
        <Reveal
          key={service.id}
          className={`mosaic__cell mosaic__cell--${service.id}`}
          delay={index * 0.05}
        >
          <ServiceCard
            service={service}
            index={index}
            open={openId === service.id}
            dimmed={openId !== null && openId !== service.id}
            onToggle={() =>
              setOpenId((current) => (current === service.id ? null : service.id))
            }
          />
        </Reveal>
      ))}
    </div>
  );
}
