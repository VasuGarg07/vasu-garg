export default function Projects({ projects }: { projects: any[] }) {
  const work     = projects.filter(p => p.type === "work");
  const personal = projects.filter(p => p.type === "personal");

  return (
    <>
      <hr className="m-divider" />
      <section id="projects" className="m-section">
        <div className="m-container">
          <div className="m-sec-eyebrow section-reveal">Work</div>
          <div className="m-sec-title section-reveal" style={{marginBottom:"2.5rem"}}>
            Projects
          </div>

          <div className="m-proj__group-title section-reveal">Work Projects</div>
          <div className="m-proj-list">
            {work.map((p, i) => <ProjectRow key={p.name} project={p} index={i+1} />)}
          </div>

          <div className="m-proj__group-title section-reveal" style={{marginTop:"2.5rem"}}>Personal Projects</div>
          <div className="m-proj-list">
            {personal.map((p, i) => <ProjectRow key={p.name} project={p} index={i+1} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectRow({ project: p, index }: { project: any; index: number }) {
  const href = p.live || p.github;
  const isLinked = !!href;

  const inner = (
    <>
      <div className="m-proj__num">0{index}</div>
      <div>
        <div className="m-proj__title">{p.name}</div>
        <div className="m-proj__tags">
          {p.stack.slice(0, 4).map((s: string) => (
            <span key={s} className="m-proj__tag">{s}</span>
          ))}
        </div>
      </div>
      <div className="m-proj__arrow">
        {isLinked ? "↗" : <span className="m-proj__internal">Internal</span>}
      </div>
    </>
  );

  if (isLinked) {
    return (
      <a className="m-proj-row section-reveal" href={href} target="_blank" rel="noopener">
        {inner}
      </a>
    );
  }

  return (
    <div className="m-proj-row m-proj-row--static section-reveal">
      {inner}
    </div>
  );
}