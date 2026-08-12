"use client";

import { useEffect, useRef } from "react";
import { createSmokeBackground } from "@/lib/smokeBackground";

/**
 * Hero backdrop. The container carries a CSS gradient that stands in whenever
 * WebGL2 is missing — the module marks itself unavailable and the canvas is
 * hidden, so there is never a blank hero.
 */
export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const smoke = createSmokeBackground(canvas);
    return () => smoke.destroy();
  }, []);

  return (
    <div className="hero__media">
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__scrim" />
    </div>
  );
}
