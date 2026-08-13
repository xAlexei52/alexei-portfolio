"use client";

import type { Service } from "@/lib/content";

/** The cursor cue shown centred over a tile on hover. */
function HandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.2a1.4 1.4 0 0 1 2.8 0V11m0-.8a1.4 1.4 0 0 1 2.8 0v1.3m0-.6a1.4 1.4 0 0 1 2.7 0V15a6 6 0 0 1-6 6h-1.8a5 5 0 0 1-3.8-1.8L4 15.2a1.5 1.5 0 0 1 2.3-2l2.7 2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  service: Service;
  index: number;
  /** `banner` is the wide anchor card; `tile` is a grid cell. */
  variant: "banner" | "tile";
  open: boolean;
  onToggle: () => void;
};

export default function ServiceCard({ service, variant, open, onToggle }: Props) {
  /* The banner carries its own copy and its own buttons, so it is a section
     rather than a button — only the tiles toggle on click. */
  if (variant === "banner") {
    return (
      <article className={`banner service--${service.accent}`}>
        <figure className="banner__art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt="" width={1400} height={860} />
        </figure>

        <div className="banner__body">
          <p className="banner__flag">Destacado</p>
          <h3 className="banner__title">
            Integración de <span>modelos de IA</span>
          </h3>
          <p className="banner__text">{service.description}</p>

          <ul className="banner__points">
            {service.bullets.map((bullet) => (
              <li key={bullet}>
                <span className="banner__point-mark" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

          <div className="banner__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={onToggle}
              aria-expanded={open}
            >
              {open ? "Ocultar detalle" : "Ver detalle"}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h13m-5-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a className="btn btn--ghost" href="#contacto">
              Hablar con un experto
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={`tile service--${service.accent}`}
      data-open={open ? "true" : undefined}
      onClick={onToggle}
      aria-expanded={open}
    >
      <figure className="tile__art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt="" width={720} height={720} loading="lazy" />
      </figure>

      <h4 className="tile__title">{service.title}</h4>
      <p className="tile__text">{service.tagline}</p>

      <span className="tile__arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h13m-5-6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Hover state: everything else dims behind a single centred prompt. */}
      <span className="tile__veil" aria-hidden="true">
        <span className="tile__cue">
          <HandIcon />
          Ver detalle
        </span>
      </span>
    </button>
  );
}
