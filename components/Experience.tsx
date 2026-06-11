export default function Experience({ experience }: { experience: any[] }) {
  const dateBadgeColors = ["y","g","p","b"];
  return (
    <section id="experience" className="p-section section-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--orange">Experience</span>
          <h2 className="p-sec-title">Where I've worked 💼</h2>
        </div>
        <div className="p-tl">
          {experience.map((exp, i) => (
            <div key={i} className="p-tl-card">
              <div className="p-tl-card__top">
                <div>
                  <div className="p-tl-card__role">{exp.role}</div>
                  <div className="p-tl-card__company">🏢 {exp.company} · {exp.location}</div>
                </div>
                <div className={`p-tl-card__date p-tl-card__date--${dateBadgeColors[i % dateBadgeColors.length]}`}>
                  {exp.period}
                </div>
              </div>
              <ul className="p-tl-card__list">
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

