"use client";

import { useState } from "react";

import { STACK } from "@/lib/content";

/** One line-art mark per stack group. */
function GroupIcon({ index }: { index: number }) {
  const shared = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  // Cloud, code, server, database, cube — in STACK order.
  if (index === 0) {
    return (
      <svg {...shared}>
        <path d="M6.5 18a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.5-1.2A3.8 3.8 0 0 1 18 18H6.5Z" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...shared}>
        <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...shared}>
        <rect x="3" y="4" width="18" height="7" rx="2" />
        <rect x="3" y="13" width="18" height="7" rx="2" />
        <path d="M7 7.5h.01M7 16.5h.01" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg {...shared}>
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <path d="M12 2.8 20 7v10l-8 4.2L4 17V7l8-4.2Z" />
      <path d="m4 7 8 4.2L20 7M12 11.2V21" />
    </svg>
  );
}

/**
 * Stack groups as cards. Wide screens show all five side by side; narrow
 * screens collapse them into an accordion so the section does not become a
 * single long column of chips.
 */
export default function StackGrid() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="stack">
      <header className="stack__head">
        <div>
          <p className="label stack__eyebrow">Mi stack</p>
          <h3 className="stack__title">Áreas de experiencia</h3>
        </div>
        <p className="stack__note">
          Tecnologías y herramientas con las que trabajo a diario.
        </p>
      </header>

      <div className="stack__grid">
        {STACK.map((group, index) => {
          const open = openIndex === index;
          return (
            <section
              className="stack-card"
              key={group.category}
              data-open={open ? "true" : undefined}
              style={{ "--i": index } as React.CSSProperties}
            >
              {/* A button only on narrow screens, where the cards collapse.
                  Wide screens keep every group open, so the control is inert
                  there and the heading reads as a heading. */}
              <button
                type="button"
                className="stack-card__head"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
              >
                <span className="stack-card__icon">
                  <GroupIcon index={index} />
                </span>
                <span className="stack-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="stack-card__name">{group.category}</span>
                <svg
                  className="stack-card__chevron"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m6 15 6-6 6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="stack-card__body">
                <ul className="stack-card__tags">
                  {group.items.map((item, j) => (
                    <li
                      className="tag"
                      key={item}
                      style={{ "--j": j } as React.CSSProperties}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
