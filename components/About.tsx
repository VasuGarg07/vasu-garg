export default function About({ profile, stats }: { profile: any; stats: any[] }) {
  const stickyColors = ["y", "p", "b"];
  return (
    <section id="about" className="nb-section">
      <div className="nb-container">
        <div className="nb-sec-head">
          <span className="nb-page-label">PAGE 01 · ABOUT</span>
          <h2 className="nb-sec-title">Margin notes <mark>about me</mark></h2>
        </div>
        <div className="nb-about__grid">
          <div className="nb-card nb-card--margin nb-about__note">
            <p>{profile.bio}</p>
            <p>{profile.bio2}</p>
            <div className="nb-about__doodles">
              <span>ships fast, breaks little ✓</span>
              <span>reads the error message first</span>
              <span>∞ cups of coffee ☕</span>
            </div>
          </div>
          <div className="nb-stickies">
            {stats.map((s, i) => (
              <div key={i} className={`nb-sticky nb-sticky--${stickyColors[i % stickyColors.length]}`}>
                <div className="nb-sticky__num">{s.value}</div>
                <div className="nb-sticky__label">{s.label}</div>
              </div>
            ))}
            <div className="nb-sticky nb-sticky--g">
              <div className="nb-sticky__hand">don&rsquo;t forget:<br />ship it!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
