export default function About({ profile, stats }: { profile: any; stats: any[] }) {
  return (
    <section id="about" className="p-section p-reveal">
      <div className="p-container">
        <div className="p-sec-head">
          <span className="p-tag p-tag--green">About</span>
          <h2 className="p-sec-title">A little about me 🙋</h2>
        </div>
        <div className="p-about__grid">
          <div className="p-fun-card">
            <p>{profile.bio}</p>
            <p style={{marginTop:"0.8rem"}}>{profile.bio2}</p>
            <div className="p-flair">
              <span className="p-flair__pill p-flair__pill--y">🎯 Problem Solver</span>
              <span className="p-flair__pill p-flair__pill--p">🚀 Fast Learner</span>
              <span className="p-flair__pill p-flair__pill--g">🤝 Team Player</span>
              <span className="p-flair__pill p-flair__pill--b">💻 Frontend Nerd</span>
            </div>
          </div>
          <div className="p-stats__grid">
            {stats.map((s, i) => (
              <div key={i} className={`p-stat-box p-stat-box--${["y","p","b","g"][i % 4]}`}>
                <div className="p-stat-box__num">{s.value}</div>
                <div className="p-stat-box__label">{s.label}</div>
              </div>
            ))}
            <div className="p-stat-box p-stat-box--g">
              <div className="p-stat-box__num">∞</div>
              <div className="p-stat-box__label">Cups of ☕</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
