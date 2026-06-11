import {
  SiJavascript, SiTypescript, SiPython, SiHtml5, SiCss,
  SiReact, SiNextdotjs, SiAngular, SiRedux, SiTailwindcss,
  SiNodedotjs, SiExpress, SiFastapi, SiGraphql,
  SiSocketdotio, SiMongodb, SiFirebase,
  SiDocker, SiGithubactions, SiGithub, SiGit, SiPostman,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { IconType } from "react-icons";

const SKILL_MAP: Record<string, { icon: IconType; color: string; bg: string }> = {
  "TypeScript":     { icon: SiTypescript,    color: "#fff", bg: "#3178C6" },
  "JavaScript":     { icon: SiJavascript,    color: "#F7DF1E", bg: "#000" },
  "Python":         { icon: SiPython,        color: "#fff", bg: "#3776AB" },
  "HTML":           { icon: SiHtml5,         color: "#fff", bg: "#E34F26" },
  "CSS":            { icon: SiCss,           color: "#fff", bg: "#1572B6" },
  "React":          { icon: SiReact,         color: "#000", bg: "#61DAFB" },
  "Next.js":        { icon: SiNextdotjs,     color: "#fff", bg: "#000000" },
  "Angular":        { icon: SiAngular,       color: "#fff", bg: "#DD0031" },
  "Redux":          { icon: SiRedux,         color: "#fff", bg: "#764ABC" },
  "Tailwind CSS":   { icon: SiTailwindcss,   color: "#fff", bg: "#06B6D4" },
  "Node.js":        { icon: SiNodedotjs,     color: "#fff", bg: "#339933" },
  "Express":        { icon: SiExpress,       color: "#fff", bg: "#259DFF" },
  "FastAPI":        { icon: SiFastapi,       color: "#fff", bg: "#009688" },
  "REST APIs":      { icon: TbApi,           color: "#fff", bg: "#F59E0B" },
  "WebSockets":     { icon: SiSocketdotio,   color: "#fff", bg: "#010101" },
  "GraphQL":        { icon: SiGraphql,       color: "#fff", bg: "#E10098" },
  "MongoDB":        { icon: SiMongodb,       color: "#fff", bg: "#47A248" },
  "Firebase":       { icon: SiFirebase,      color: "#000", bg: "#FFCA28" },
  "AWS":            { icon: FaAws,           color: "#fff", bg: "#FF9900" },
  "Docker":         { icon: SiDocker,        color: "#fff", bg: "#2496ED" },
  "GitHub Actions": { icon: SiGithubactions, color: "#fff", bg: "#2088FF" },
  "GitHub":         { icon: SiGithub,        color: "#fff", bg: "#181717" },
  "Git":            { icon: SiGit,           color: "#fff", bg: "#F05032" },
  "Postman":        { icon: SiPostman,       color: "#fff", bg: "#FF6C37" },
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