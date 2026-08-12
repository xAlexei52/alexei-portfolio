import { PROJECTS } from "@/lib/content";
import { CoverflowCarousel, type CoverflowSlide } from "./CoverflowCarousel";
import Reveal from "./Reveal";

const slides: CoverflowSlide[] = PROJECTS.map((project) => ({
  src: project.image,
  alt: project.imageAlt,
  title: project.title,
  subtitle: project.description,
  meta: project.meta,
  tags: project.stack,
  href: project.href,
}));

export default function Projects() {
  return (
    <section className="section" id="proyectos">
      <span className="kanji" aria-hidden="true">
        雲
      </span>

      <Reveal>
        <h2 className="section__title">Proyectos</h2>
      </Reveal>

      <CoverflowCarousel
        slides={slides}
        fade={0.14}
        label="Proyectos seleccionados"
        showCaption
        showPagination
        showNavigation
      />
    </section>
  );
}
