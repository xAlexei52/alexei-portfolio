import { SERVICES } from "@/lib/content";
import ServiceGlyph from "./ServiceGlyph";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section className="section" id="servicios">
      <span className="kanji" aria-hidden="true">
        仕事
      </span>

      <Reveal>
        <p className="label section__eyebrow">Lo que construimos</p>
        <h2 className="section__title">Servicios</h2>
      </Reveal>

      <div className="mosaic">
        {SERVICES.map((service, index) => (
          <Reveal
            key={service.id}
            className={`mosaic__cell mosaic__cell--${service.id}`}
            delay={index * 0.05}
          >
            <article
              className={`service service--${service.accent}`}
              data-featured={service.id === "ia" ? "true" : undefined}
            >
              <div className="service__art" aria-hidden="true">
                <ServiceGlyph name={service.glyph} />
              </div>

              <div className="service__body">
                <h3 className="service__title">{service.title}</h3>
                <p className="service__text">{service.description}</p>

                <ul className="service__bullets">
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
