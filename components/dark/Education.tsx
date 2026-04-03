export default function Education({ education }: { education: any[] }) {
  return (
    <section id="education" className="d-section section-reveal">
      <div className="d-container">
        <div className="d-sec-head">
          <div className="d-sec-tag">Background</div>
          <div className="d-sec-title">Education</div>
        </div>
        <div className="d-edu__grid">
          {education.map((edu, i) => (
            <div key={i} className="d-edu-card">
              <div className="d-edu-card__icon">{edu.emoji}</div>
              <div className="d-edu-card__degree">{edu.degree}</div>
              <div className="d-edu-card__school">{edu.institution}</div>
              <div className="d-edu-card__year">{edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
