"use client";

import { NAV_LINKS } from "@/lib/content";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div className="mobile-menu" id="mobile-menu" hidden={!open}>
      <div className="menu-overlay" onClick={onClose} />

      <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <nav className="menu-links">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.label}
              className={link.active ? "menu-link active" : "menu-link"}
              href={link.href}
              style={{ ["--i" as string]: index }}
              aria-current={link.active ? "page" : undefined}
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="menu-signin"
          href="#"
          style={{ ["--i" as string]: NAV_LINKS.length }}
          onClick={onClose}
        >
          Sign in
        </a>
      </div>
    </div>
  );
}
