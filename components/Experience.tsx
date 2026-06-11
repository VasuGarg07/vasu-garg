export default function Experience({ experience }: { experience: any[] }) {
  return (
    <section id="experience" className="nb-section">
      <div className="nb-container">
        <div className="nb-sec-head">
          <span className="nb-page-label">PAGE 03 · WORK LOG</span>
          <h2 className="nb-sec-title">Entries from <mark>the field</mark></h2>
        </div>
        <div className="nb-log">
          {experience.map((exp, i) => (
            <div key={i} className="nb-card nb-card--margin nb-log-entry">
              <div className="nb-log-entry__top">
                <div>
                  <div className="nb-log-entry__role">{exp.role}</div>
                  <div className="nb-log-entry__company">{exp.company} · {exp.location}</div>
                </div>
                <div className={`nb-stamp ${exp.current ? "nb-stamp--now" : ""}`}>
                  {exp.period}{exp.current ? " · NOW" : ""}
                </div>
              </div>
              <ul className="nb-log-entry__list">
                {exp.highlights.map((h: string, j: number) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
