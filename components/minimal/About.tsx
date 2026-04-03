export default function About({ profile, stats }: { profile: any; stats: any[] }) {
  return (
    <>
      <hr className="m-divider" />
      <section id="about" className="m-section section-reveal">
        <div className="m-container">
          <div className="m-about__grid">
            <div>
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} className="m-avatar" style={{fontSize:"unset"}} />
                : <div className="m-avatar">🧑‍💻</div>
              }
            </div>
            <div className="m-about__right">
              <div className="m-sec-eyebrow">About</div>
              <h3>Developer with an eye for detail and a mind for systems.</h3>
              <p>{profile.bio}</p>
              <p>{profile.bio2}</p>
              <div className="m-stats">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="m-stat__num">{s.value}</div>
                    <div className="m-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
