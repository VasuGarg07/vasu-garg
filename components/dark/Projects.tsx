const banners: Record<string, string> = {
  "eKYC Platform":                    "linear-gradient(135deg,#020c1b,#0a3d62)",
  "uAlgos — Algo Trading Platform":   "linear-gradient(135deg,#011a2e,#0a4d6e)",
  "Cove Drive — Encrypted Cloud Storage": "linear-gradient(135deg,#020c1b,#0d2137)",
  "Sekai":                            "linear-gradient(135deg,#0a1628,#1a3a5c)",
  "React Lab":                        "linear-gradient(135deg,#011a18,#0a3d38)",
};

export default function Projects({ projects }: { projects: any[] }) {
  const work     = projects.filter(p => p.type === "work");
  const personal = projects.filter(p => p.type === "personal");

  return (
    <section id="projects" className="d-section section-reveal">
      <div className="d-container">
        <div className="d-sec-head">
          <div className="d-sec-tag">Work</div>
          <div className="d-sec-title">Featured Projects</div>
          <div className="d-sec-sub">A selection of things I've built</div>
        </div>

        <div className="d-proj__group-title">💼 Work Projects</div>
        <div className="d-projects__grid">
          {work.map(p => <ProjectCard key={p.name} project={p} />)}
        </div>

        <div className="d-proj__group-title">🧑‍💻 Personal Projects</div>
        <div className="d-projects__grid">
          {personal.map(p => <ProjectCard key={p.name} project={p} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: any }) {
  return (
    <div className="d-proj-card">
      <div className="d-proj-card__banner" style={{background: banners[p.name] || "linear-gradient(135deg,#020c1b,#0a3d62)"}}>
        {p.emoji}
      </div>
      <div className="d-proj-card__body">
        <div className="d-proj-card__tags">
          {p.stack.slice(0,3).map((s: string) => (
            <span key={s} className="d-proj-card__tag">{s}</span>
          ))}
        </div>
        <div className="d-proj-card__title">{p.name}</div>
        <div className="d-proj-card__desc">{p.description}</div>
        <div className="d-proj-card__links">
          {p.live   && <a href={p.live}   target="_blank" rel="noopener" className="d-proj-card__link">↗ Live Demo</a>}
          {p.github && <a href={p.github} target="_blank" rel="noopener" className="d-proj-card__link">⌥ GitHub</a>}
          {!p.live && !p.github && <span className="d-proj-card__link--muted">Internal Project</span>}
        </div>
      </div>
    </div>
  );
}
