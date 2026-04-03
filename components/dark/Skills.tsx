"use client";
import { useEffect } from "react";
import {
  SiJavascript, SiTypescript, SiHtml5,
  SiReact, SiAngular, SiTailwindcss, SiMui,
  SiNodedotjs, SiFirebase, SiMongodb,
  SiGit, SiGithub, SiJira,
} from "react-icons/si";
import { VscCode, VscSymbolColor } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { IconType } from "react-icons";

const SKILL_MAP: Record<string, { icon: IconType; color: string; bg: string; level: number }> = {
  // Core — daily use for 3+ years
  "JavaScript":   { icon: SiJavascript,  color: "#000", bg: "#F7DF1E", level: 90 },
  "TypeScript":   { icon: SiTypescript,  color: "#fff", bg: "#3178C6", level: 85 },
  "HTML":         { icon: SiHtml5,       color: "#fff", bg: "#E34F26", level: 92 },
  "CSS":          { icon: VscSymbolColor,color: "#fff", bg: "#1572B6", level: 88 },
  // Frontend frameworks — React is primary, Angular secondary
  "React":        { icon: SiReact,       color: "#000", bg: "#61DAFB", level: 90 },
  "Angular":      { icon: SiAngular,     color: "#fff", bg: "#DD0031", level: 75 },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#fff", bg: "#06B6D4", level: 82 },
  "Material UI":  { icon: SiMui,         color: "#fff", bg: "#007FFF", level: 80 },
  // Backend — used but not primary focus
  "Node.js":      { icon: SiNodedotjs,   color: "#fff", bg: "#339933", level: 60 },
  "REST APIs":    { icon: TbApi,         color: "#fff", bg: "#f59e0b", level: 82 },
  "Firebase":     { icon: SiFirebase,    color: "#000", bg: "#FFCA28", level: 72 },
  "MongoDB":      { icon: SiMongodb,     color: "#fff", bg: "#47A248", level: 58 },
  // Tools — regular professional use
  "Git":          { icon: SiGit,         color: "#fff", bg: "#F05032", level: 85 },
  "GitHub":       { icon: SiGithub,      color: "#fff", bg: "#181717", level: 85 },
  "JIRA":         { icon: SiJira,        color: "#fff", bg: "#0052CC", level: 78 },
  "VSCode":       { icon: VscCode,       color: "#fff", bg: "#007ACC", level: 90 },
  "Cursor":       { icon: VscCode,       color: "#fff", bg: "#6E56CF", level: 70 },
};

export default function Skills({ skills }: { skills: any[] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const fills = document.querySelectorAll(".d-skill-fill");
      const sio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const w = (e.target as HTMLElement).dataset.w;
            setTimeout(() => { (e.target as HTMLElement).style.width = w + "%"; }, 200);
            sio.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      fills.forEach(el => sio.observe(el));
      return () => sio.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="skills" className="d-section section-reveal">
      <div className="d-container">
        <div className="d-sec-head">
          <div className="d-sec-tag">Toolkit</div>
          <div className="d-sec-title">Skills & Technologies</div>
          <div className="d-sec-sub">Tools I work with day-to-day</div>
        </div>
        <div className="d-skills__grid">
          {skills.flatMap((g: any) => g.items).map((item: string) => {
            const s = SKILL_MAP[item];
            const Icon = s?.icon;
            return (
              <div key={item} className="d-skill-card">
                <div className="d-skill-card__top">
                  {Icon && (
                    <span className="d-skill-card__icon-bubble" style={{ background: s.bg }}>
                      <Icon size={15} color={s.color} />
                    </span>
                  )}
                  <span className="d-skill-card__name">{item}</span>
                </div>
                <div className="d-skill-bar">
                  <div
                    className="d-skill-fill"
                    data-w={s?.level ?? 75}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}