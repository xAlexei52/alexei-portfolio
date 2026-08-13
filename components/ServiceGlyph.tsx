import type { ServiceGlyph as GlyphName } from "@/lib/content";

/**
 * Line illustrations for the services mosaic. Every shape inherits
 * `currentColor` for its accent and `--kinari-30` for structure, so a card only
 * has to set one colour.
 */
export default function ServiceGlyph({ name }: { name: GlyphName }) {
  const shared = {
    className: "glyph",
    viewBox: "0 0 120 72",
    role: "presentation" as const,
    "aria-hidden": true,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const structure = "var(--kinari-30)";

  if (name === "ai") {
    // A fan of inputs collapsing into one decided output.
    return (
      <svg {...shared}>
        <g stroke={structure} strokeWidth="1">
          <path d="M8 12h22M8 26h22M8 40h22M8 54h22" />
        </g>
        {/* Split into one path per line: the pulse rides a single feed at a
            time via getPointAtLength, which needs separate elements. */}
        <g className="glyph__feed" stroke="currentColor" strokeWidth="1.2" opacity="0.85">
          <path d="M30 12c18 0 22 18 30 24" />
          <path d="M30 26c14 0 18 8 30 10" />
          <path d="M30 40c14 0 18-2 30-4" />
          <path d="M30 54c18 0 22-18 30-24" />
        </g>
        <circle
          className="glyph__node"
          cx="62"
          cy="36"
          r="7"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="62" cy="36" r="2.4" fill="currentColor" stroke="none" />
        {/* Parked at the node until a pulse starts; JS drives cx/cy. */}
        <circle
          className="glyph__pulse"
          cx="62"
          cy="36"
          r="2.6"
          fill="currentColor"
          stroke="none"
          opacity="0"
        />
        <path d="M69 36h16" stroke="currentColor" strokeWidth="1.4" />
        <rect
          x="85"
          y="26"
          width="27"
          height="20"
          rx="5"
          stroke={structure}
          strokeWidth="1"
        />
        <path d="M91 36h15" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (name === "automation") {
    // One trigger branching into parallel steps that rejoin.
    return (
      <svg {...shared}>
        <rect
          x="6"
          y="28"
          width="20"
          height="16"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M26 36h12c4 0 4-16 8-16h10M26 36h20M26 36h12c4 0 4 16 8 16h10"
          stroke={structure}
          strokeWidth="1"
        />
        <rect x="56" y="12" width="20" height="16" rx="4" stroke={structure} strokeWidth="1" />
        <rect x="56" y="28" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.3" />
        <rect x="56" y="44" width="20" height="16" rx="4" stroke={structure} strokeWidth="1" />
        <path
          d="M76 20h8c4 0 4 16 8 16h6M76 36h14M76 52h8c4 0 4-16 8-16h6"
          stroke={structure}
          strokeWidth="1"
        />
        <circle cx="104" cy="36" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M100.5 36l2.6 2.8 4.6-5.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === "cloud") {
    // Function invocations stacking under an elastic ceiling.
    return (
      <svg {...shared}>
        <path
          d="M28 30a12 12 0 0 1 23-4 9 9 0 0 1 13 3 10 10 0 0 1 1 20H30a11 11 0 0 1-2-19Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <g stroke={structure} strokeWidth="1">
          <path d="M34 60h52" />
        </g>
        <g stroke="currentColor" strokeWidth="1.3">
          <path d="M78 42v18M90 36v24M102 46v14" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="78" cy="42" r="2.2" />
          <circle cx="90" cy="36" r="2.2" />
          <circle cx="102" cy="46" r="2.2" />
        </g>
      </svg>
    );
  }

  if (name === "erp") {
    // Modules docked around a shared ledger.
    return (
      <svg {...shared}>
        <rect
          x="42"
          y="22"
          width="36"
          height="28"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M48 31h24M48 36h24M48 41h15" />
        </g>
        <g stroke={structure} strokeWidth="1">
          <rect x="6" y="10" width="24" height="16" rx="4" />
          <rect x="6" y="46" width="24" height="16" rx="4" />
          <rect x="90" y="10" width="24" height="16" rx="4" />
          <rect x="90" y="46" width="24" height="16" rx="4" />
          <path d="M30 18h6c4 0 6 4 6 8M30 54h6c4 0 6-4 6-8M90 18h-6c-4 0-6 4-6 8M90 54h-6c-4 0-6-4-6-8" />
        </g>
      </svg>
    );
  }

  if (name === "crm") {
    // A funnel narrowing toward a closed deal.
    return (
      <svg {...shared}>
        <g stroke="currentColor" strokeWidth="1.3">
          <path d="M10 14h46l-9 12H19z" />
        </g>
        <g stroke={structure} strokeWidth="1">
          <path d="M19 30h28l-7 12H26z" />
          <path d="M26 46h14l-5 12h-4z" />
        </g>
        <g stroke={structure} strokeWidth="1">
          <path d="M68 20h44M68 34h44M68 48h30" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="64" cy="20" r="2.4" />
          <circle cx="64" cy="34" r="2.4" />
        </g>
        <circle cx="64" cy="48" r="2.4" fill={structure} stroke="none" />
      </svg>
    );
  }

  if (name === "web") {
    // A browser frame with its content blocks laid in.
    return (
      <svg {...shared}>
        <rect
          x="10"
          y="10"
          width="100"
          height="52"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M10 22h100" stroke="currentColor" strokeWidth="1.2" />
        <g fill={structure} stroke="none">
          <circle cx="18" cy="16" r="2" />
          <circle cx="25" cy="16" r="2" />
          <circle cx="32" cy="16" r="2" />
        </g>
        <rect x="18" y="30" width="34" height="24" rx="3" stroke="currentColor" strokeWidth="1.2" />
        <g stroke={structure} strokeWidth="1">
          <path d="M60 32h42M60 40h42M60 48h28" />
        </g>
      </svg>
    );
  }

  // plugin — a connector seating into a host slot
  return (
    <svg {...shared}>
      <rect
        x="62"
        y="14"
        width="48"
        height="44"
        rx="6"
        stroke={structure}
        strokeWidth="1"
      />
      <path
        d="M62 26h-9M62 46h-9"
        stroke={structure}
        strokeWidth="1"
      />
      <path
        d="M40 22h14v28H40a8 8 0 0 1-8-8v-3h-6v-6h6v-3a8 8 0 0 1 8-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <g stroke="currentColor" strokeWidth="1.3">
        <path d="M54 30h14M54 42h14" />
      </g>
      <g stroke={structure} strokeWidth="1">
        <path d="M74 22v28M86 22v28M98 22v28" />
      </g>
    </svg>
  );
}
