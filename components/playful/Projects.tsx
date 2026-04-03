export default function Projects({ projects }: { projects: any[] }) {
  const work     = projects.filter(p => p.type === "work");
  const personal = projects.filter(p => p.type === "personal");

  return (
    <section id="projects" className="p-section p-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--pink">Projects</span>
          <h2 className="p-sec-title">Things I've built 🔨</h2>
        </div>

        <h3 className="p-proj__group-title">Work Projects</h3>
        <div className="p-proj__grid">
          {work.map(p => <ProjectCard key={p.name} project={p} />)}
        </div>

        <h3 className="p-proj__group-title" style={{marginTop:"2.5rem"}}>Personal Projects</h3>
        <div className="p-proj__grid">
          {personal.map(p => <ProjectCard key={p.name} project={p} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: any }) {
  return (
    <div className="p-proj-card">
      <div className="p-proj-card__top" style={{background: p.color}}>
        <span>{p.emoji}</span>
      </div>
      <div className="p-proj-card__body">
        <div className="p-proj-card__chips">
          {p.stack.slice(0,3).map((s: string) => (
            <span key={s} className="p-proj-card__chip">{s}</span>
          ))}
        </div>
        <h4 className="p-proj-card__title">{p.name}</h4>
        <p className="p-proj-card__desc">{p.description}</p>
        <div className="p-proj-card__links">
          {p.live   && <a href={p.live}   target="_blank" rel="noopener" className="p-proj-link">↗ Demo</a>}
          {p.github && <a href={p.github} target="_blank" rel="noopener" className="p-proj-link">⌥ Code</a>}
          {!p.live && !p.github && <span className="p-proj-link p-proj-link--muted">Internal Project</span>}
        </div>
      </div>
    </div>
  );
}
