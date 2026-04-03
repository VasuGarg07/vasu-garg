export default function Experience({ experience }: { experience: any[] }) {
  return (
    <section id="experience" className="d-section section-reveal">
      <div className="d-container">
        <div className="d-sec-head">
          <div className="d-sec-tag">Career</div>
          <div className="d-sec-title">Work Experience</div>
        </div>
        <div className="d-timeline">
          {experience.map((exp, i) => (
            <div key={i} className="d-tl-item">
              <div className="d-tl-dot" />
              <div className="d-tl-card">
                <div className="d-tl-header">
                  <div>
                    <div className="d-tl-role">{exp.role}</div>
                    <div className="d-tl-company">{exp.company} · {exp.location}</div>
                  </div>
                  <div className="d-tl-date">{exp.period}</div>
                </div>
                <ul className="d-tl-list">
                  {exp.highlights.map((h: string, j: number) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
