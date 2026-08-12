import { existsSync } from "node:fs";
import path from "node:path";

import { SITE } from "@/lib/content";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

/**
 * The CV links only render once the PDF is actually in public/ — a download
 * button pointing at a 404 is worse than no button.
 */
function resolveCvHref() {
  const file = path.join(process.cwd(), "public", SITE.cvPath);
  return existsSync(file) ? SITE.cvPath : null;
}

export default function Home() {
  const cvHref = resolveCvHref();

  return (
    <>
      <SiteNav />

      <main>
        <Hero cvHref={cvHref} />
        <Metrics />
        <About />
        <Experience />
        <Projects />
        <Contact cvHref={cvHref} />
      </main>

      <footer className="site-footer">
        © 2026 {SITE.name} · Zapopan, MX
      </footer>
    </>
  );
}
