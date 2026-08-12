import { EXPERIENCE } from "@/lib/content";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section className="section" id="experiencia">
      <span className="kanji" aria-hidden="true">
        経歴
      </span>

      <Reveal>
        <h2 className="section__title">Experiencia</h2>
      </Reveal>

      <ol className="timeline">
        {EXPERIENCE.map((job, index) => (
          <li
            className={index < 2 ? "job job--recent" : "job"}
            key={`${job.role}-${job.period}`}
          >
            <Reveal delay={index * 0.05}>
              <span className="job__node" aria-hidden="true" />
              <span className="job__period">{job.period}</span>
              <h3 className="job__role">
                {job.role}
                {job.company ? (
                  <span className="job__company"> — {job.company}</span>
                ) : null}
              </h3>
              <p className="job__description">{job.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
