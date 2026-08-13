"use client";

import { useEffect } from "react";

/** Tolerance in px when matching a card edge to the mosaic edge. */
const EPSILON = 2;

/**
 * Flags whichever cards sit at the four corners of the services mosaic, by
 * measuring rather than by id.
 *
 * The grid is irregular — two cells span two columns, one spans two rows — and
 * it reflows from four columns to two to one. That means the card in any given
 * corner changes with the viewport, and CSS has no way to ask "are you at the
 * edge of your grid". Each corner card gets `data-corner` listing the corners
 * it occupies ("tl", "tr br", …), which globals.css turns into a radius.
 */
export function useMosaicCorners(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mosaic = ref.current;
    if (!mosaic) return;

    const measure = () => {
      const cards = Array.from(
        mosaic.querySelectorAll<HTMLElement>(".service"),
      );
      if (cards.length === 0) return;

      const rects = cards.map((card) => card.getBoundingClientRect());

      // Derive the mosaic's own bounds from the cards, not from the container:
      // a hovered card is translated upward, and its own rect must not be what
      // defines the top edge.
      const left = Math.min(...rects.map((r) => r.left));
      const right = Math.max(...rects.map((r) => r.right));
      const top = Math.min(...rects.map((r) => r.top));
      const bottom = Math.max(...rects.map((r) => r.bottom));

      cards.forEach((card, i) => {
        const r = rects[i];
        const corners: string[] = [];
        const atLeft = Math.abs(r.left - left) < EPSILON;
        const atRight = Math.abs(r.right - right) < EPSILON;
        const atTop = Math.abs(r.top - top) < EPSILON;
        const atBottom = Math.abs(r.bottom - bottom) < EPSILON;

        if (atTop && atLeft) corners.push("tl");
        if (atTop && atRight) corners.push("tr");
        if (atBottom && atRight) corners.push("br");
        if (atBottom && atLeft) corners.push("bl");

        if (corners.length > 0) card.dataset.corner = corners.join(" ");
        else delete card.dataset.corner;
      });
    };

    measure();

    // Re-measure on reflow: the breakpoints reshuffle which card is where.
    const observer = new ResizeObserver(measure);
    observer.observe(mosaic);

    return () => observer.disconnect();
  }, [ref]);
}
