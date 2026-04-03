export default function Hero({ profile }: { profile: any }) {
  const chips = ["React","Angular",  "TypeScript", "Node.js", "Firebase", "Git"];
  return (
    <section id="d-hero">
      <div className="d-container">
        <div className="d-hero__inner">
          <div className="d-hero__badge">
            {profile.available && <span className="d-hero__dot" />}
            {profile.available ? "Open to opportunities" : "Currently busy"}
          </div>
          <h1 className="d-hero__title">
            Hi, I'm <span>{profile.name}</span> 👋
          </h1>
          <p className="d-hero__sub">{profile.bio}</p>
          <div className="d-hero__actions">
            <a href="#projects" className="d-btn d-btn--primary">✦ View my work</a>
            <a href={profile.cv} download className="d-btn d-btn--ghost">⬇ Download CV</a>
          </div>
          <div className="d-hero__chips">
            {chips.map(c => <span key={c} className="d-chip">{c}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
