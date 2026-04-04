"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { Theme } from "@/config";

const OPTIONS: { value: Theme; label: string; emoji: string }[] = [
  { value: "playful", label: "Playful", emoji: "🎨" },
  { value: "dark", label: "Bold", emoji: "🌙" },
  { value: "minimal", label: "Minimal", emoji: "✦" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      zIndex: 999, display: "flex", flexDirection: "column",
      alignItems: "flex-end", gap: ".5rem",
    }}>
      {/* Options — shown when open */}
      {open && OPTIONS.map(o => (
        <button
          key={o.value}
          onClick={() => { setTheme(o.value); setOpen(false); }}
          style={{
            display: "flex", alignItems: "center", gap: ".5rem",
            padding: ".5rem 1rem", borderRadius: "999px",
            border: "none", cursor: "pointer", fontSize: ".82rem", fontWeight: 700,
            background: theme === o.value ? "#111" : "#fff",
            color: theme === o.value ? "#fff" : "#111",
            boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            transition: "all .15s", whiteSpace: "nowrap",
          }}
        >
          <span>{o.emoji}</span> {o.label}
          {theme === o.value && (
            <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
              {/* ping ring */}
              <span style={{
                position: "absolute", inset: 0,
                borderRadius: "50%", background: "#22c55e", opacity: .75,
                animation: "ping 1.2s cubic-bezier(0,0,.2,1) infinite",
              }} />
              {/* solid dot */}
              <span style={{
                position: "relative", width: 8, height: 8,
                borderRadius: "50%", background: "#22c55e",
              }} />
            </span>
          )}
        </button>
      ))}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        title="Switch theme"
        style={{
          width: "44px", height: "44px", borderRadius: "50%",
          border: "none", cursor: "pointer", fontSize: "1.2rem",
          background: "#111", color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        {open ? "✕" : "🎨"}
      </button>
    </div>
  );
}