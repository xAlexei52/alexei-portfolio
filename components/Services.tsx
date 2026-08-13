import ServicesMosaic from "./ServicesMosaic";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section className="section" id="servicios">
      <span className="kanji" aria-hidden="true">
        構築
      </span>

      <Reveal>
        <p className="label section__eyebrow">Lo que construimos</p>
        <h2 className="section__title">Servicios</h2>
        <p className="section__lead">
          Soluciones tecnológicas que impulsan tu negocio desde la
          infraestructura hasta la inteligencia artificial.
        </p>
      </Reveal>

      <ServicesMosaic />
    </section>
  );
}
