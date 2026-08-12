import { SITE, SOLUTIONS } from "@/lib/content";
import HeroShader from "./HeroShader";

type HeroProps = {
  cvHref: string | null;
};

export default function Hero({ cvHref }: HeroProps) {
  return (
    <section className="hero" id="inicio">
      <HeroShader />

      <div className="hero__inner">
        <div className="hero__content">
          <p className="label hero__eyebrow">
            {SITE.name} · {SITE.role} · {SITE.location}
          </p>

          <h1 className="hero__headline">
            {SITE.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <p className="hero__intro">{SITE.intro}</p>

          <ul className="hero__solutions" aria-label="Soluciones">
            {SOLUTIONS.map((solution) => (
              <li key={solution}>{solution}</li>
            ))}
          </ul>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#servicios">
              Ver servicios
            </a>
            <a className="btn btn--ghost" href="#proyectos">
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
