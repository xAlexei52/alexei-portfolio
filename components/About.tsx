import { ABOUT_TEXT, SITE, STACK } from "@/lib/content";
import Reveal from "./Reveal";

/** Quiet facts beside the prose, so the column is not one flat paragraph. */
const CREDENTIALS = [
  { k: "Título", v: "Ing. de Software · UTJ" },
  { k: "Base", v: "Zapopan, Jalisco" },
  { k: "Modalidad", v: "Remoto · híbrido" },
];

export default function About() {
  return (
    <section className="section about" id="sobre-mi">
      <span className="kanji" aria-hidden="true">
        開発
      </span>

      <Reveal>
        <p className="label section__eyebrow">Quién está detrás</p>
        <h2 className="section__title">Sobre mí</h2>
      </Reveal>

      <div className="about__grid">
        <Reveal>
          <div className="about__lead">
            {/* Pulled from the prose so the column opens on a statement
                rather than on a block of body copy. */}
            <p className="about__quote">
              Trabajo en la intersección de <em>cloud</em> e <em>IA</em>.
            </p>

            <p className="about__text">{ABOUT_TEXT}</p>

            <dl className="about__facts">
              {CREDENTIALS.map((item) => (
                <div className="about__fact" key={item.k}>
                  <dt>{item.k}</dt>
                  <dd>{item.v}</dd>
                </div>
              ))}
            </dl>

            <a className="about__mail" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="stack">
            {STACK.map((group, index) => (
              <div
                className="stack-group"
                key={group.category}
                style={{ "--i": index } as React.CSSProperties}
              >
                <h3 className="label stack-group__title">
                  <span className="stack-group__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {group.category}
                </h3>
                <ul className="stack-group__tags">
                  {group.items.map((item, j) => (
                    <li
                      className="tag"
                      key={item}
                      style={{ "--j": j } as React.CSSProperties}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
