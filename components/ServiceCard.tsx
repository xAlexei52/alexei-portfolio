"use client";

import { useEffect, useRef } from "react";

import type { Service } from "@/lib/content";
import { attachCardSurface, type CardHandle } from "@/lib/cardSurface";
import ServiceGlyph from "./ServiceGlyph";

/**
 * Per-card surface character. Intensity tracks the accent ladder so the
 * shader reinforces the same hierarchy the colours state, and each flow
 * direction is distinct so no two cards sweep alike.
 */
const SURFACE: Record<string, { intensity: number; flow: [number, number] }> = {
  ia: { intensity: 1, flow: [0.92, 0.38] },
  automatizacion: { intensity: 0.66, flow: [-0.74, 0.67] },
  aws: { intensity: 0.5, flow: [0.36, -0.93] },
  erp: { intensity: 0.36, flow: [-0.88, -0.47] },
  crm: { intensity: 0.5, flow: [0.62, 0.78] },
  web: { intensity: 0.66, flow: [-0.42, -0.91] },
  plugins: { intensity: 0.36, flow: [0.81, -0.59] },
};

const DRAW_MS = 900;
/** Gap between light pulses along the featured glyph's input lines. */
const PULSE_PERIOD_MS = 4000;
const PULSE_TRAVEL_MS = 1100;
/** Matches the CSS node-flash duration, so the flash ends with the arrival. */
const FLASH_MS = 420;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Which edge the pointer crossed, as the nearest one to the entry point. The
 * gradient origin is placed there, so the tint grows inward from the side the
 * cursor actually came from.
 */
function entryOrigin(rect: DOMRect, clientX: number, clientY: number) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const distances = [
    { edge: "top", d: y, x: `${(x / rect.width) * 100}%`, y: "0%" },
    { edge: "right", d: rect.width - x, x: "100%", y: `${(y / rect.height) * 100}%` },
    { edge: "bottom", d: rect.height - y, x: `${(x / rect.width) * 100}%`, y: "100%" },
    { edge: "left", d: x, x: "0%", y: `${(y / rect.height) * 100}%` },
  ];

  return distances.reduce((nearest, edge) => (edge.d < nearest.d ? edge : nearest));
}

export default function ServiceCard({
  service,
  index,
  open,
  dimmed,
  onToggle,
}: {
  service: Service;
  index: number;
  /** This card is the expanded one. */
  open: boolean;
  /** Another card is expanded, so this one recedes. */
  dimmed: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<CardHandle | null>(null);
  const featured = service.id === "ia";

  /* Live surface behind the card, drawn by the shared canvas. */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const config = SURFACE[service.id] ?? { intensity: 0.5, flow: [1, 0] as [number, number] };
    // Index-derived seed: stable across reloads, distinct per card.
    const handle = attachCardSurface(card, {
      seed: index * 1.618 + 0.37,
      intensity: config.intensity,
      flow: config.flow,
    });

    if (!handle) {
      // No WebGL2: the card keeps its CSS gradient and nothing else changes.
      card.dataset.surface = "unavailable";
      return;
    }

    surfaceRef.current = handle;
    card.dataset.surface = "live";

    return () => {
      surfaceRef.current = null;
      handle.release();
    };
  }, [service.id, index]);

  /* Draw the line art once, the first time the card is seen. */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const paths = Array.from(
      card.querySelectorAll<SVGGeometryElement>(".glyph path, .glyph rect, .glyph circle"),
    );
    if (paths.length === 0) return;

    // Filled dots have no stroke to draw; animating them would blank them out.
    const strokable = paths.filter((path) => {
      const stroke = getComputedStyle(path).stroke;
      return stroke !== "none" && stroke !== "";
    });
    if (strokable.length === 0) return;

    if (prefersReducedMotion()) {
      card.dataset.drawn = "true";
      return;
    }

    for (const path of strokable) {
      const length = path.getTotalLength();
      // Stored per element: the CSS transition interpolates the offset back to
      // 0, and the dash array has to match the individual path length.
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Once per card, as asked: stop observing before drawing.
          observer.disconnect();

          for (const path of strokable) {
            path.style.transition = `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            path.style.strokeDashoffset = "0";
          }
          card.dataset.drawn = "true";
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  /* Featured card only: a light travelling the input lines into the node. */
  useEffect(() => {
    if (!featured) return;
    const card = cardRef.current;
    if (!card) return;

    const svg = card.querySelector<SVGSVGElement>(".glyph");
    const pulse = card.querySelector<SVGCircleElement>(".glyph__pulse");
    const node = card.querySelector<SVGCircleElement>(".glyph__node");
    if (!svg || !pulse || !node) return;

    if (prefersReducedMotion()) return;

    // The four converging strokes live in one path element; splitting them by
    // subpath would need a parser, so the pulse rides the whole path and the
    // visible portion is the inbound run.
    const lines = Array.from(
      svg.querySelectorAll<SVGPathElement>(".glyph__feed path"),
    );
    if (lines.length === 0) return;

    let frame = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let lineIndex = 0;

    const runPulse = () => {
      const line = lines[lineIndex % lines.length];
      lineIndex += 1;

      const length = line.getTotalLength();
      const start = performance.now();

      // Seat it at the line's origin *before* revealing it. Showing it first
      // would flash one frame at wherever the previous run left it.
      const origin = line.getPointAtLength(0);
      pulse.setAttribute("cx", `${origin.x}`);
      pulse.setAttribute("cy", `${origin.y}`);
      pulse.style.opacity = "1";

      const step = (now: number) => {
        const t = Math.min((now - start) / PULSE_TRAVEL_MS, 1);
        // easeInOutSine: leaves and arrives calmly, quick through the middle.
        const eased = 0.5 - Math.cos(t * Math.PI) / 2;
        const point = line.getPointAtLength(eased * length);

        pulse.setAttribute("cx", `${point.x}`);
        pulse.setAttribute("cy", `${point.y}`);

        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }

        pulse.style.opacity = "0";
        node.classList.add("is-hit");
        flashTimer = setTimeout(() => node.classList.remove("is-hit"), FLASH_MS);
      };

      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      runPulse();
      timer = setInterval(runPulse, PULSE_PERIOD_MS);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
      if (timer !== undefined) clearInterval(timer);
      if (flashTimer !== undefined) clearTimeout(flashTimer);
      timer = undefined;
      flashTimer = undefined;
      pulse.style.opacity = "0";
      node.classList.remove("is-hit");
    };

    // Runs only while the card is on screen and the tab is in front.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !document.hidden) start();
          else stop();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(card);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (card.dataset.onscreen === "true") start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Mirrors intersection state for the visibility handler above.
    const track = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          card.dataset.onscreen = entry.isIntersecting ? "true" : "false";
        }
      },
      { threshold: 0.2 },
    );
    track.observe(card);

    return () => {
      observer.disconnect();
      track.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [featured]);

  /* Hover tint, propagating from whichever edge the cursor crossed. */
  const onPointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const origin = entryOrigin(card.getBoundingClientRect(), event.clientX, event.clientY);
    card.style.setProperty("--tint-x", origin.x);
    card.style.setProperty("--tint-y", origin.y);
    surfaceRef.current?.setHover(1);
  };

  const onPointerLeave = () => {
    // While expanded the surface stays lit: the card is the focus of the
    // section, not something the pointer happens to be over.
    surfaceRef.current?.setHover(open ? 1 : 0);
  };

  /* Keep the surface hot for as long as the card is open. */
  useEffect(() => {
    surfaceRef.current?.setHover(open ? 1 : 0);
  }, [open]);

  return (
    <article
      ref={cardRef}
      className={`service service--${service.accent}`}
      data-featured={featured ? "true" : undefined}
      data-open={open ? "true" : undefined}
      data-dimmed={dimmed ? "true" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      role="button"
      aria-expanded={open}
      aria-label={`${service.title}. Ver detalle`}
      tabIndex={0}
      onFocus={() => surfaceRef.current?.setHover(1)}
      onBlur={() => surfaceRef.current?.setHover(0)}
    >
      <span className="service__overlay" aria-hidden="true" />

      <div className="service__art" aria-hidden="true">
        <ServiceGlyph name={service.glyph} />
      </div>

      {/* Resting state: the title alone, large, at the foot of the card. */}
      <h3 className="service__title">{service.title}</h3>

      {/* Cue that the card opens. Appears on hover, hidden once expanded. */}
      <span className="service__cue" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.2a1.4 1.4 0 0 1 2.8 0V11m0-.8a1.4 1.4 0 0 1 2.8 0v1.3m0-.6a1.4 1.4 0 0 1 2.7 0V15a6 6 0 0 1-6 6h-1.8a5 5 0 0 1-3.8-1.8L4 15.2a1.5 1.5 0 0 1 2.3-2l2.7 2.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Ver detalle
      </span>

      {/* Detail. Collapsed inline on hover; laid out as a right-hand panel
          once the card is expanded across the mosaic. */}
      <div className="service__reveal">
        {/* Single grid child: the 0fr → 1fr collapse only measures one row. */}
        <div className="service__reveal-inner">
          <p className="service__text">{service.description}</p>

          <ul className="service__bullets">
            {service.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          {open ? (
            <button
              type="button"
              className="service__close"
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
            >
              Cerrar
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
