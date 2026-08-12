import { PROJECTS } from "@/lib/content";
import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section className="section" id="proyectos">
      <span className="kanji" aria-hidden="true">
        雲
      </span>

      <Reveal>
        <h2 className="section__title">Proyectos</h2>
      </Reveal>

      <div className="projects__grid">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.title} delay={index * 0.06}>
            <article className="project">
              <h3 className="project__title">{project.title}</h3>
              <p className="project__description">{project.description}</p>

              <ul className="project__tags">
                {project.stack.map((tech) => (
                  <li className="tag" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>

              {project.href ? (
                <a
                  className="project__link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Ver proyecto
                </a>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
