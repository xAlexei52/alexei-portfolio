"use client";

import { NAV_LINKS, SECTION_IDS, SITE } from "@/lib/content";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import MobileMenu from "./MobileMenu";

export default function SiteNav() {
  const { open, toggle, close } = useMobileMenu();
  const activeId = useScrollSpy(SECTION_IDS);

  return (
    <>
      <header className="site-header">
        <a className="logo-btn" href="#inicio" aria-label={`${SITE.name} — inicio`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.webp" alt="" width={52} height={52} />
        </a>

        <nav className="nav-pill" aria-label="Secciones">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              className={activeId === link.id ? "nav-link active" : "nav-link"}
              href={link.href}
              aria-current={activeId === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href={`mailto:${SITE.email}`}>
          Escríbeme
        </a>

        <button
          type="button"
          className="burger"
          aria-label="Menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggle}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <MobileMenu open={open} onClose={close} activeId={activeId} />
    </>
  );
}
