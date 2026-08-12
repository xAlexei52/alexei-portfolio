"use client";

import { useCallback, useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 720;

/**
 * Open/close state for the mobile sheet menu. Mirrors the state onto
 * `body.menu-open` and closes on Escape or on resize past the desktop
 * breakpoint.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onResize = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) close();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return { open, toggle, close };
}
