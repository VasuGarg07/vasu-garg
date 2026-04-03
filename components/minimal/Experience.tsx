export default function Experience({ experience }: { experience: any[] }) {
  return (
    <>
      <hr className="m-divider" />
      <section id="experience" className="m-section">
        <div className="m-container">
          <div className="m-sec-eyebrow section-reveal">Career</div>
          <div className="m-sec-title section-reveal" style={{marginBottom:"2.5rem"}}>Experience</div>
          <div className="m-exp-list">
            {experience.map((exp, i) => (
              <div key={i} className="m-exp-row section-reveal">
                <div className="m-exp__date">{exp.period.replace("–", "—")}</div>
                <div>
                  <div className="m-exp__role">{exp.role}</div>
                  <div className="m-exp__company">{exp.company} · {exp.location}</div>
                  <ul className="m-exp__list">
                    {exp.highlights.map((h: string, j: number) => <li key={j}>{h}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

