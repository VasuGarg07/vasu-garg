"use client";
import { useState, useEffect } from "react";

const links = ["About","Projects","Skills","Experience","Education","Contact"];

export default function Nav({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="d-nav">
        <div className="d-nav__logo">&lt;{profile.name.split(" ")[0]} /&gt;</div>
        <ul className="d-nav__links">
          {links.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <button
          className={`d-nav__burger ${open ? "d-nav__burger--open" : ""}`}
          onClick={() => setOpen(!open)} aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="d-nav__drawer" role="dialog" aria-modal="true">
          <button className="d-nav__drawer-close" onClick={() => setOpen(false)}>✕</button>
          <div className="d-nav__drawer-links">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
