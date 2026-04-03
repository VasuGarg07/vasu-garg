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
  "JavaScript":   { icon: SiJavascript,   color: "#000", bg: "#F7DF1E" },
  "TypeScript":   { icon: SiTypescript,   color: "#fff", bg: "#3178C6" },
  "HTML":         { icon: SiHtml5,        color: "#fff", bg: "#E34F26" },
  "CSS":          { icon: VscSymbolColor, color: "#fff", bg: "#1572B6" },
  "React":        { icon: SiReact,        color: "#000", bg: "#61DAFB" },
  "Angular":      { icon: SiAngular,      color: "#fff", bg: "#DD0031" },
  "Tailwind CSS": { icon: SiTailwindcss,  color: "#fff", bg: "#06B6D4" },
  "Material UI":  { icon: SiMui,          color: "#fff", bg: "#007FFF" },
  "Node.js":      { icon: SiNodedotjs,    color: "#fff", bg: "#339933" },
  "REST APIs":    { icon: TbApi,          color: "#fff", bg: "#f59e0b" },
  "Firebase":     { icon: SiFirebase,     color: "#000", bg: "#FFCA28" },
  "MongoDB":      { icon: SiMongodb,      color: "#fff", bg: "#47A248" },
  "Git":          { icon: SiGit,          color: "#fff", bg: "#F05032" },
  "GitHub":       { icon: SiGithub,       color: "#fff", bg: "#181717" },
  "JIRA":         { icon: SiJira,         color: "#fff", bg: "#0052CC" },
  "VSCode":       { icon: VscCode,        color: "#fff", bg: "#007ACC" },
  "Cursor":       { icon: VscCode,        color: "#fff", bg: "#6E56CF" },
};

export default function Skills({ skills }: { skills: any[] }) {
  return (
    <>
      <hr className="m-divider" />
      <section id="skills" className="m-section section-reveal">
        <div className="m-container">
          <div className="m-skills__wrap">
            <div>
              <div className="m-sec-eyebrow" style={{marginBottom:".4rem"}}>Toolkit</div>
              <div className="m-sec-title">Skills</div>
            </div>
            <div className="m-skill-groups">
              {skills.map((group) => (
                <div key={group.category}>
                  <div className="m-sg__title">{group.category}</div>
                  <div className="m-sg__items">
                    {group.items.map((item: string) => {
                      const s = SKILL_MAP[item];
                      const Icon = s?.icon;
                      return (
                        <span key={item} className="m-sk">
                          {Icon && (
                            <span className="m-sk__icon" style={{background: s.bg}}>
                              <Icon size={13} color={s.color} />
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
          </div>
        </div>
      </section>
    </>
  );
}
