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
      <nav className="m-nav">
        <div className="m-nav__logo">{profile.name}</div>
        <ul className="m-nav__links">
          {links.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <button
          className={`m-nav__burger ${open ? "m-nav__burger--open" : ""}`}
          onClick={() => setOpen(!open)} aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="m-nav__drawer" role="dialog" aria-modal="true">
          <button className="m-nav__drawer-close" onClick={() => setOpen(false)}>✕</button>
          <div className="m-nav__drawer-links">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
