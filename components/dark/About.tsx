export default function About({ profile, stats }: { profile: any; stats: any[] }) {
  return (
    <section id="about" className="d-section section-reveal section-reveal">
      <div className="d-container">
        <div className="d-about__grid">
          <div>
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.name} className="d-avatar" style={{fontSize:"unset"}} />
              : <div className="d-avatar">🧑‍💻</div>
            }
          </div>
          <div className="d-about__text">
            <div className="d-sec-tag">About me</div>
            <h3>Developer. Creator. Problem Solver.</h3>
            <p>{profile.bio}</p>
            <p>{profile.bio2}</p>
            <div className="d-stats">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="d-stat__num">{s.value}</div>
                  <div className="d-stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

