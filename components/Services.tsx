import ServicesMosaic from "./ServicesMosaic";
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

      <ServicesMosaic />
    </section>
  );
}
