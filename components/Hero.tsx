import { SITE } from "@/lib/content";
import HeroMedia from "./HeroMedia";

type HeroProps = {
  cvHref: string | null;
};

export default function Hero({ cvHref }: HeroProps) {
  return (
    <section className="hero" id="inicio">
      <HeroMedia />

      <div className="hero__inner">
        <div className="hero__content">
          <span className="label hero__eyebrow">{SITE.location}</span>

          <h1 className="hero__name">{SITE.name}</h1>

          <p className="hero__role">
            <strong>{SITE.role}</strong> — {SITE.tagline}
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#proyectos">
              Ver proyectos
            </a>
            {cvHref ? (
              <a className="btn btn--ghost" href={cvHref} download>
                Descargar CV
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
