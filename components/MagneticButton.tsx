"use client";

import * as React from "react";

type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    /** Fraction of the cursor offset the element follows. */
    pull?: number;
  };

/**
 * Leans toward the cursor and springs back on leave. Skipped entirely on
 * coarse pointers and under prefers-reduced-motion, where the transform would
 * either never fire or be unwelcome.
 */
export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  function MagneticButton(
    { as: Component = "button", className, children, pull = 0.35, ...props },
    forwardedRef,
  ) {
    const localRef = React.useRef<HTMLElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const enabled = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
      const element = localRef.current;
      if (!element || !enabled()) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      element.style.setProperty("--mag-x", `${x * pull}px`);
      element.style.setProperty("--mag-y", `${y * pull}px`);
      element.dataset.magnetic = "active";
    };

    const onPointerLeave = () => {
      const element = localRef.current;
      if (!element) return;
      element.style.setProperty("--mag-x", "0px");
      element.style.setProperty("--mag-y", "0px");
      element.dataset.magnetic = "idle";
    };

    return (
      <Component
        ref={setRef}
        className={["magnetic", className].filter(Boolean).join(" ")}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
