import Image from "next/image";
import ProjectSketch, { hasSketch } from "@/components/ProjectSketch";

export default function Projects({ projects }: { projects: any[] }) {
  const work     = projects.filter(p => p.type === "work");
  const personal = projects.filter(p => p.type === "personal");

  return (
    <section id="projects" className="nb-section">
      <div className="nb-container">
        <div className="nb-sec-head">
          <span className="nb-page-label">PAGE 04 · PROJECTS</span>
          <h2 className="nb-sec-title">Things I&rsquo;ve <mark>built &amp; shipped</mark></h2>
        </div>

        <h3 className="nb-proj__group-title">case files — <em>on the clock</em></h3>
        <div className="nb-proj__grid">
          {work.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
        </div>

        <h3 className="nb-proj__group-title" style={{ marginTop: "3.2rem" }}>
          weekend pages — <em>for the fun of it</em>
        </h3>
        <div className="nb-proj__grid">
          {personal.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: any; index: number }) {
  return (
    <div className="nb-proj-card">
      <span className="nb-proj-card__tab">
        FILE {String(index + 1).padStart(2, "0")}{p.type === "work" ? "" : " · SIDE"}
      </span>
      {p.image
        ? <div className="nb-proj-card__top nb-proj-card__top--image">
            <Image src={p.image} alt={p.name} width={480} height={300} loading="lazy" className="nb-proj-card__img" />
          </div>
        : <div className="nb-proj-card__top" style={{ background: p.color }}>
            <ProjectSketch name={p.sketch} />
          </div>
      }
      <div className="nb-proj-card__body">
        <div className="nb-proj-card__chips">
          {p.stack.slice(0, 3).map((s: string) => (
            <span key={s} className="nb-proj-card__chip">{s}</span>
          ))}
        </div>
        <h4 className="nb-proj-card__title">{p.name}</h4>
        <p className="nb-proj-card__desc">{p.description}</p>
        {p.highlights && (
          <ul className="nb-proj-card__deliverables">
            {p.highlights.map((h: string, i: number) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
        <div className="nb-proj-card__links">
          {p.live   && <a href={p.live}   target="_blank" rel="noopener" className="nb-proj-link">↗ Live demo</a>}
          {p.github && <a href={p.github} target="_blank" rel="noopener" className="nb-proj-link">⌥ Source</a>}
          {!p.live && !p.github && <span className="nb-proj-link nb-proj-link--muted">internal — ask me about it</span>}
        </div>
      </div>
    </div>
  );
}
