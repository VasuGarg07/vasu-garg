import {
  SiJavascript, SiTypescript, SiHtml5,
  SiReact, SiAngular, SiTailwindcss, SiMui,
  SiNodedotjs, SiFirebase, SiMongodb,
  SiGit, SiGithub, SiJira,
} from "react-icons/si";
import { VscCode, VscSymbolColor } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { IconType } from "react-icons";

const SKILL_MAP: Record<string, { icon: IconType; color: string; bg: string }> = {
  "JavaScript":   { icon: SiJavascript,  color: "#000", bg: "#F7DF1E" },
  "TypeScript":   { icon: SiTypescript,  color: "#fff", bg: "#3178C6" },
  "HTML":         { icon: SiHtml5,       color: "#fff", bg: "#E34F26" },
  "CSS":          { icon: VscSymbolColor,color: "#fff", bg: "#1572B6" },
  "React":        { icon: SiReact,       color: "#000", bg: "#61DAFB" },
  "Angular":      { icon: SiAngular,     color: "#fff", bg: "#DD0031" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#fff", bg: "#06B6D4" },
  "Material UI":  { icon: SiMui,         color: "#fff", bg: "#007FFF" },
  "Node.js":      { icon: SiNodedotjs,   color: "#fff", bg: "#339933" },
  "REST APIs":    { icon: TbApi,         color: "#fff", bg: "#f59e0b" },
  "Firebase":     { icon: SiFirebase,    color: "#000", bg: "#FFCA28" },
  "MongoDB":      { icon: SiMongodb,     color: "#fff", bg: "#47A248" },
  "Git":          { icon: SiGit,         color: "#fff", bg: "#F05032" },
  "GitHub":       { icon: SiGithub,      color: "#fff", bg: "#181717" },
  "JIRA":         { icon: SiJira,        color: "#fff", bg: "#0052CC" },
  "VSCode":       { icon: VscCode,       color: "#fff", bg: "#007ACC" },
  "Cursor":       { icon: VscCode,       color: "#fff", bg: "#6E56CF" },
};

const colors = ["y", "p", "b", "g", "o"];

export default function Skills({ skills }: { skills: any[] }) {
  return (
    <section id="skills" className="p-section section-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--blue">Skills</span>
          <h2 className="p-sec-title">My toolkit 🧰</h2>
        </div>
        {skills.map((group, gi) => (
          <div key={group.category} className="p-skill-group">
            <h3 className="p-skill-group__title">{group.category}</h3>
            <div className="p-skill-cloud">
              {group.items.map((item: string, ii: number) => {
                const s = SKILL_MAP[item];
                const Icon = s?.icon;
                return (
                  <span key={item} className={`p-sk p-sk--${colors[(gi + ii) % colors.length]}`}>
                    {Icon && (
                      <span className="p-sk__icon" style={{ background: s.bg }}>
                        <Icon size={18} color={s.color} />
                      </span>
                    )}
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}