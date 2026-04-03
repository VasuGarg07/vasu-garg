export default function Skills({ skills }: { skills: any[] }) {
  const colors = ["y","p","b","g","o"];
  return (
    <section id="skills" className="p-section p-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--blue">Skills</span>
          <h2 className="p-sec-title">My toolkit 🧰</h2>
        </div>
        {skills.map((group, gi) => (
          <div key={group.category} className="p-skill-group">
            <h3 className="p-skill-group__title">{group.category}</h3>
            <div className="p-skill-cloud">
              {group.items.map((item: string, ii: number) => (
                <span key={item} className={`p-sk p-sk--${colors[(gi + ii) % colors.length]}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
