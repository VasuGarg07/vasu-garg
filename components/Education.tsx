export default function Education({ education }: { education: any[] }) {
  return (
    <section id="education" className="nb-section">
      <div className="nb-container">
        <div className="nb-sec-head">
          <span className="nb-page-label">PAGE 05 · EDUCATION</span>
          <h2 className="nb-sec-title">Where the <mark>notebook started</mark></h2>
        </div>
        <div className="nb-edu__grid">
          {education.map((edu, i) => (
            <div key={i} className="nb-edu-card">
              <div className="nb-edu-card__icon">{edu.emoji}</div>
              <div className="nb-edu-card__deg">{edu.degree}</div>
              <div className="nb-edu-card__school">{edu.institution} · {edu.location}</div>
              <div className="nb-edu-card__year">{edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
