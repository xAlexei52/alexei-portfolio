"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reactive `matchMedia`. Returns false during SSR and on first paint, so the
 * markup a crawler or a slow device sees is always the cheap variant.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
