import Image from "next/image";

const checklist = [
  { done: true,  text: "Ship an AI chat interface with streaming LLM responses", note: "← cut design time 40%!" },
  { done: true,  text: "Build a verification platform for 10,000+ submissions", note: "6 clients live" },
  { done: true,  text: "Encrypt files so even the server can't read them", note: "zero-knowledge!" },
  { done: true,  text: "Get promoted to Senior Engineer", note: "may '24 ☆" },
  { done: false, text: "Join a team building something ambitious", note: "→ that's where you come in" },
];

export default function Hero({ profile }: { profile: any }) {
  return (
    <section id="hero" className="nb-hero">
      <span className="nb-stain" aria-hidden="true" />
      <div className="nb-container">
        <div className="nb-hero__badge">
          <span className="nb-hero__spark" aria-hidden="true">✦</span>
          <strong className="nb-hero__badge-text">Open to Work</strong>
        </div>
        <br />
        <span className="nb-hero__kicker">notebook of a builder ↓</span>
        <h1 className="nb-hero__title">
          Hi, I&rsquo;m {profile.name.split(" ")[0]} — I turn messy problems into <mark>shipped software</mark>.
        </h1>
        <p className="nb-hero__sub">{profile.bio}</p>

        <div className="nb-hero__grid">
          <ul className="nb-check-list">
            {checklist.map((item, i) => (
              <li key={i}>
                <span className={`nb-check ${item.done ? "nb-check--done" : ""}`}>
                  {item.done ? "✓" : ""}
                </span>
                <div>
                  {item.text}
                  <span className="nb-annot">{item.note}</span>
                </div>
              </li>
            ))}
          </ul>

          <figure className="nb-polaroid nb-tape">
            <div className="nb-polaroid__photo">
              {profile.profile_image
                ? <Image
                    src={profile.profile_image}
                    alt={profile.name}
                    width={320}
                    height={320}
                    priority
                  />
                : <span aria-hidden="true">🧑‍💻</span>
              }
            </div>
            <figcaption>me, running on vibes and plausible deniability</figcaption>
          </figure>
        </div>

        <div className="nb-hero__btns">
          <a href="#projects" className="nb-btn nb-btn--fill">Read the project pages</a>
          <span className="nb-cv">
            <a href={profile.cv} download className="nb-btn">Grab my CV</a>
            {/* <span className="nb-arrow">start here</span> */}
          </span>
          <a href="#contact" className="nb-btn">Leave a note</a>
        </div>
      </div>
    </section>
  );
}
