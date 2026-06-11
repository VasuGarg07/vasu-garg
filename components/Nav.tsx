"use client";
import { useState, useEffect } from "react";

const links = ["About", "Skills", "Experience", "Projects", "Education", "Contact"];

export default function Nav({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="nb-nav">
        <div className="nb-nav__logo">
          {profile.name.split(" ")[0]}&rsquo;s <em>notebook</em> ✎
        </div>

        <ul className="nb-nav__links">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>

        <button
          className={`nb-nav__burger ${open ? "nb-nav__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div className="nb-nav__drawer" role="dialog" aria-modal="true">
          <button className="nb-nav__drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
          <div className="nb-nav__drawer-links">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>
                {l}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
