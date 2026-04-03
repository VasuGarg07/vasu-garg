"use client";
import { useState, useEffect } from "react";

const links = ["About", "Projects", "Skills", "Experience", "Education", "Contact"];

export default function Nav({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="p-nav">
        <div className="p-nav__logo">{profile.name.split(" ")[0]} ✦</div>

        {/* Desktop links — hidden on mobile via CSS */}
        <ul className="p-nav__links">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>

        {/* Hamburger — visible on mobile only */}
        <button
          className={`p-nav__burger ${open ? "p-nav__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer — rendered outside nav so it overlays everything */}
      {open && (
        <div className="p-nav__drawer" role="dialog" aria-modal="true">
          {/* Close button */}
          <button className="p-nav__drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
          <div className="p-nav__drawer-links">
            {links.map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setOpen(false)}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}