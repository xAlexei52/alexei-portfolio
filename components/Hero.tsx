import { HERO_FACTS, SITE, SOLUTIONS } from "@/lib/content";
import HeroShader from "./HeroShader";

type HeroProps = {
  cvHref: string | null;
};

export default function Hero({ cvHref }: HeroProps) {
  const [firstLine, secondLine] = SITE.headline;
  // The closing word carries the accent, so it is split off from its line.
  const lastSpace = secondLine.lastIndexOf(" ");
  const secondHead = secondLine.slice(0, lastSpace + 1);
  const secondTail = secondLine.slice(lastSpace + 1);

  return (
    <section className="hero" id="inicio">
      <HeroShader />

      <div className="hero__inner">
        <div className="hero__grid">
          <div className="hero__content">
            <p className="label hero__eyebrow">
              <span className="hero__dot" aria-hidden="true" />
              {SITE.name} · {SITE.role}
            </p>

            <h1 className="hero__headline">
              <span>{firstLine}</span>
              <span>
                {secondHead}
                <span className="hero__headline-accent">{secondTail}</span>
              </span>
            </h1>

            <p className="hero__intro">{SITE.intro}</p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#servicios">
                Ver servicios
              </a>
              <a className="btn btn--ghost" href="#proyectos">
                Ver proyectos
              </a>
              {cvHref ? (
                <a className="hero__cv" href={cvHref} download>
                  Descargar CV
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1.5v8M2.75 6.5 6 9.75 9.25 6.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>

          {/* Counterweight to the copy. Hidden below the grid breakpoint,
              where the location already reads in the eyebrow's place. */}
          <dl className="hero__facts">
            {HERO_FACTS.map((fact) => (
              <div className="hero__fact" key={fact.value}>
                <dt className="hero__fact-value">{fact.value}</dt>
                <dd className="hero__fact-label">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Runs the full width beneath both columns: it is what closes the
            composition on the right. */}
        <p className="hero__solutions" aria-label="Soluciones">
          {SOLUTIONS.join(" · ")}
        </p>
      </div>
    </section>
  );
}
