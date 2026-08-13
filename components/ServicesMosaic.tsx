"use client";

import { useEffect, useRef, useState } from "react";

import { SERVICES } from "@/lib/content";
import ServiceCard from "./ServiceCard";
import ServiceDetail from "./ServiceDetail";
import Reveal from "./Reveal";

const [FEATURED, ...REST] = SERVICES;

/**
 * Services layout: the anchor service as a full-width band, the rest as a
 * grid of tiles below it. Opening a tile swaps its row for a detail panel
 * beside the art, rather than expanding over the whole section.
 */
export default function ServicesMosaic() {
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  /* Opening swaps a short row of tiles for a taller panel. Holding the grid's
     top edge still keeps the card under the cursor instead of letting the
     page slide. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const before = grid.getBoundingClientRect().top;
    const id = requestAnimationFrame(() => {
      const drift = grid.getBoundingClientRect().top - before;
      if (Math.abs(drift) > 1) window.scrollBy({ top: drift, behavior: "instant" });
    });
    return () => cancelAnimationFrame(id);
  }, [openId]);

  const open = SERVICES.find((service) => service.id === openId) ?? null;

  return (
    <div className="services">
      <Reveal>
        <ServiceCard
          service={FEATURED}
          index={0}
          variant="banner"
          open={openId === FEATURED.id}
          onToggle={() =>
            setOpenId((current) => (current === FEATURED.id ? null : FEATURED.id))
          }
        />
      </Reveal>

      <Reveal delay={0.06}>
        <header className="services__head">
          <p className="label services__eyebrow">Nuestros servicios</p>
          <h3 className="services__title">Todo lo que tu negocio necesita</h3>
        </header>
      </Reveal>

      <div className="services__grid" ref={gridRef} data-has-open={open ? "true" : undefined}>
        {REST.map((service, index) => (
          <Reveal
            key={service.id}
            className="services__cell"
            delay={0.04 + index * 0.04}
          >
            <ServiceCard
              service={service}
              index={index + 1}
              variant="tile"
              open={openId === service.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === service.id ? null : service.id,
                )
              }
            />
          </Reveal>
        ))}
      </div>

      {/* Detail sits below the grid rather than over it: the panel is the
          height of the featured card, so covering the section would leave a
          large empty area under it. */}
      <ServiceDetail service={open} onClose={() => setOpenId(null)} />

      <Reveal>
        <aside className="services__cta">
          <span className="services__cta-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.2 13.9 9l5.8 1.9-5.8 1.9L12 18.6 10.1 12.8 4.3 10.9 10.1 9 12 3.2Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="services__cta-title">¿No ves lo que necesitas?</p>
            <p className="services__cta-text">
              Creamos soluciones a la medida de tu negocio.
            </p>
          </div>
          <a className="btn btn--ghost services__cta-btn" href="#contacto">
            Cuéntanos tu idea
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h13m-5-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </aside>
      </Reveal>
    </div>
  );
}
