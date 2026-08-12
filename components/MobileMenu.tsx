"use client";

import { NAV_LINKS, SITE } from "@/lib/content";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
};

export default function MobileMenu({ open, onClose, activeId }: MobileMenuProps) {
  return (
    <div className="mobile-menu" id="mobile-menu" hidden={!open}>
      <div className="menu-overlay" onClick={onClose} />

      <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menú">
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.id}
            className={activeId === link.id ? "menu-link active" : "menu-link"}
            href={link.href}
            style={{ ["--i" as string]: index }}
            aria-current={activeId === link.id ? "true" : undefined}
            onClick={onClose}
          >
            {link.label}
          </a>
        ))}

        <a
          className="btn btn--ghost menu-cta"
          href={`mailto:${SITE.email}`}
          style={{ ["--i" as string]: NAV_LINKS.length }}
          onClick={onClose}
        >
          Escríbeme
        </a>
      </div>
    </div>
  );
}
