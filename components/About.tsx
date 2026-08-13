import { ABOUT_TEXT, SITE } from "@/lib/content";
import Reveal from "./Reveal";
import StackGrid from "./StackGrid";

const META = [
  { icon: "pin", label: "Base", value: "Zapopan, Jalisco" },
  { icon: "screen", label: "Modalidad", value: "Remoto · híbrido" },
  { icon: "mail", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

function MetaIcon({ name }: { name: string }) {
  const shared = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "pin") {
    return (
      <svg {...shared}>
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    );
  }
  if (name === "screen") {
    return (
      <svg {...shared}>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M9 21h6M12 17v4" />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export default function About() {
  return (
    <section className="section about" id="sobre-mi">
      <div className="about__panels">
        <Reveal>
          <div className="about__card">
            <span className="kanji about__kanji" aria-hidden="true">
              開発
            </span>

            <div className="about__intro">
              <p className="label about__eyebrow">Quién está detrás</p>
              <h2 className="about__title">
                Sobre <span>mí</span>
              </h2>

              <p className="about__quote">
                Trabajo en la intersección de <em>cloud</em> e <em>IA</em>.
              </p>

              <p className="about__text">{ABOUT_TEXT}</p>

              <div className="about__sign">
                {/* Drawn, not a font: a signature should not depend on a
                    webfont that may never load. */}
                <svg
                  className="about__signature"
                  viewBox="0 0 150 54"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 42c10-3 15-13 17-22 1-6-1-9-4-8-4 1-5 9-3 16 2 8 7 13 12 12 6-1 9-9 10-15 0-3 2-3 2 0 1 7 4 12 9 12 4 0 7-4 8-9 0-2 2-2 2 0 1 6 4 10 8 10 5 0 9-6 11-13"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M92 34c8-1 20-6 27-13M78 47c14-2 40-6 58-14"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="about__degree">Ing. de Software · UTJ</span>
              </div>
            </div>

            <div className="about__art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/about-iso.png" alt="" width={1000} height={900} />
            </div>

            <dl className="about__meta">
              {META.map((item) => (
                <div className="about__meta-item" key={item.label}>
                  <span className="about__meta-icon">
                    <MetaIcon name={item.icon} />
                  </span>
                  <div>
                    <dt>{item.label}</dt>
                    <dd>
                      {item.href ? (
                        <a href={item.href}>{item.value}</a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <StackGrid />
        </Reveal>
      </div>
    </section>
  );
}
