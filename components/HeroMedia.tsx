"use client";

import { HERO_VIDEO } from "@/lib/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Below 768px, or when the visitor asked for reduced motion, only the poster
 * is served — the loop is never downloaded.
 */
export default function HeroMedia() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const showVideo = isDesktop && !prefersReducedMotion;

  return (
    <div className="hero__media">
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_VIDEO.poster}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO.webm} type="video/webm" />
          <source src={HERO_VIDEO.mp4} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={HERO_VIDEO.poster} alt="" fetchPriority="high" />
      )}
      <div className="hero__scrim" />
    </div>
  );
}
