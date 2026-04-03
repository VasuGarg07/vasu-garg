export default function Hero({ profile }: { profile: any }) {
  const chips = ["React", "TypeScript", "Angular", "Node.js", "Firebase", "Git"];
  return (
    <section id="m-hero">
      <div className="m-container">
        <div className="m-hero__label">
          {profile.available && <span className="m-hero__dot" />}
          Senior Frontend Developer
        </div>
        <h1 className="m-hero__title">
          {profile.name}.<br />
          <em>Building for the web.</em>
        </h1>
        <p className="m-hero__sub">{profile.bio}</p>
        <div className="m-hero__actions">
          <a href="#projects" className="m-btn m-btn--dark">View Work</a>
          <a href={profile.cv} download className="m-btn m-btn--outline">Download CV</a>
          <a href="#contact" className="m-btn m-btn--outline">Get in touch</a>
        </div>
        <div className="m-hero__chips">
          {chips.map(c => <span key={c} className="m-chip">{c}</span>)}
        </div>
      </div>
    </section>
  );
}
