"use client";

import { useRef } from "react";

import { SERVICES } from "@/lib/content";
import { useMosaicCorners } from "@/hooks/useMosaicCorners";
import ServiceCard from "./ServiceCard";
import Reveal from "./Reveal";

/**
 * Client boundary for the mosaic alone, so Services itself stays a server
 * component. Only the corner measurement needs a ref.
 */
export default function ServicesMosaic() {
  const ref = useRef<HTMLDivElement>(null);
  useMosaicCorners(ref);

  return (
    <div className="mosaic" ref={ref}>
      {SERVICES.map((service, index) => (
        <Reveal
          key={service.id}
          className={`mosaic__cell mosaic__cell--${service.id}`}
          delay={index * 0.05}
        >
          <ServiceCard service={service} index={index} />
        </Reveal>
      ))}
    </div>
  );
}
