"use client";

import { useEffect, useState } from "react";

/** Reports which of the given section ids is currently closest to the top. */
export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Kept across callbacks: an observer only reports what *changed*, so a
    // section merely leaving the band would otherwise strand the previous
    // winner as active.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }

        if (intersecting.size === 0) return;

        const winner = [...intersecting]
          .map((id) => ({
            id,
            top: document.getElementById(id)?.getBoundingClientRect().top ?? 0,
          }))
          .sort((a, b) => a.top - b.top)[0];

        setActiveId(winner.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
