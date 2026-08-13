"use client";

import { useEffect, useRef, useState } from "react";

import type { Service } from "@/lib/content";

/**
 * Detail for the open service: the art on the left, a flat panel of copy on
 * the right. Sized to the featured card rather than to the whole section, so
 * closing one does not leave a field of empty space behind.
 *
 * The service is held locally for the length of the close transition — the
 * parent clears it immediately, and without a copy the panel would blank out
 * mid-collapse instead of easing away.
 */
export default function ServiceDetail({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Hold the last non-null service for the length of the close transition:
     the parent clears `service` at once, and without this the panel would
     blank out mid-collapse instead of easing away. Adjusting state during
     render is React's documented pattern for deriving from props. */
  const [last, setLast] = useState<Service | null>(service);
  if (service && service !== last) setLast(service);
  const shown = service ?? last;

  /* Bring a freshly opened panel into view when it lands off-screen. */
  useEffect(() => {
    if (!service) return;
    const panel = panelRef.current;
    if (!panel) return;
    const id = requestAnimationFrame(() => {
      const rect = panel.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [service]);

  if (!shown) return null;

  return (
    <div
      className="detail"
      ref={panelRef}
      data-open={service ? "true" : undefined}
      role="region"
      aria-label={shown.title}
    >
      <div className="detail__inner">
        <figure className="detail__art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown.image} alt="" width={720} height={720} />
        </figure>

        <div className="detail__body">
          <p className="label detail__eyebrow">Servicio</p>
          <h4 className="detail__title">{shown.title}</h4>
          <p className="detail__text">{shown.description}</p>

          <ul className="detail__bullets">
            {shown.bullets.map((bullet) => (
              <li key={bullet}>
                <span className="detail__check" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 13 4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <div className="detail__actions">
            <a className="btn btn--primary" href="#contacto">
              Hablar de este servicio
            </a>
            <button type="button" className="detail__close" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
