export default function Education({ education }: { education: any[] }) {
  return (
    <>
      <hr className="m-divider" />
      <section id="education" className="m-section">
        <div className="m-container">
          <div className="m-sec-eyebrow section-reveal">Background</div>
          <div className="m-sec-title section-reveal" style={{marginBottom:"2.5rem"}}>Education</div>
          <div className="m-edu-list">
            {education.map((edu, i) => (
              <div key={i} className="m-edu-row section-reveal">
                <div className="m-edu__year">{edu.period}</div>
                <div>
                  <div className="m-edu__deg">{edu.degree}</div>
                  <div className="m-edu__school">{edu.institution}</div>
                  <div className="m-edu__note">{edu.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
