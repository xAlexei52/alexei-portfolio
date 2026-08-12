import { ABOUT_TEXT, STACK } from "@/lib/content";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="section" id="sobre-mi">
      <span className="kanji" aria-hidden="true">
        開発
      </span>

      <Reveal>
        <h2 className="section__title">Sobre mí</h2>
      </Reveal>

      <div className="about__grid">
        <Reveal>
          <p className="about__text">{ABOUT_TEXT}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            {STACK.map((group) => (
              <div className="stack-group" key={group.category}>
                <h3 className="label stack-group__title">{group.category}</h3>
                <ul className="stack-group__tags">
                  {group.items.map((item) => (
                    <li className="tag" key={item}>
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
