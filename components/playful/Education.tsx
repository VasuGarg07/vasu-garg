export default function Education({ education }: { education: any[] }) {
  const cardColors = ["b","p", "y"];
  return (
    <section id="education" className="p-section section-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--green">Education</span>
          <h2 className="p-sec-title">How I got here 🎓</h2>
        </div>
        <div className="p-edu__grid">
          {education.map((edu, i) => (
            <div key={i} className={`p-edu-card p-edu-card--${cardColors[i % cardColors.length]}`}>
              <div className="p-edu-card__icon">{edu.emoji}</div>
              <div className="p-edu-card__deg">{edu.degree}</div>
              <div className="p-edu-card__school">{edu.institution}</div>
              <div className="p-edu-card__year">{edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
