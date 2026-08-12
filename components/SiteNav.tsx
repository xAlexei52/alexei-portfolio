"use client";

import { NAV_LINKS } from "@/lib/content";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import MobileMenu from "./MobileMenu";

export default function SiteNav() {
  const { open, toggle, close } = useMobileMenu();

  return (
    <>
      <header className="site-header">
        <a className="logo-btn" href="#" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.webp" alt="" width={52} height={52} />
        </a>

        <nav className="nav-pill" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              className={link.active ? "nav-link active" : "nav-link"}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="sign-in" href="#">
          Sign in
        </a>

        <button
          type="button"
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggle}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <MobileMenu open={open} onClose={close} />
    </>
  );
}
