export default function Hero({ profile }: { profile: any }) {
    return (
        <section id="hero" className="p-hero">
            <div className="p-container">
                <div className="p-hero__inner">
                    <div className="p-hero__left">
                        <div className="p-hero__badge">
                            {profile.available && <span className="p-hero__dot" />}
                            {profile.available ? "Open to work" : "Currently busy"}
                        </div>
                        <h1 className="p-hero__title">
                            Hey, I'm<br />
                            <em>{profile.name}</em> 👋
                        </h1>
                        <p className="p-hero__sub">{profile.tagline}</p>
                        <div className="p-hero__btns">
                            <a href="#projects" className="p-btn p-btn--y">✦ See my work</a>
                            <a href={profile.cv} download className="p-btn p-btn--p">⬇ Download CV</a>
                            <a href="#contact" className="p-btn p-btn--outline">Say hello →</a>
                        </div>
                    </div>
                    {profile.avatar
                        ? <img src={profile.avatar} alt={profile.name} className="p-hero__avatar" />
                        : <div className="p-hero__avatar" aria-hidden="true">🧑‍💻</div>
                    }        </div>
            </div>
            <div className="p-doodles" aria-hidden="true">
                <span className="p-doodle p-doodle--1">★</span>
                <span className="p-doodle p-doodle--2">◆</span>
                <span className="p-doodle p-doodle--3">●</span>
                <span className="p-doodle p-doodle--4">▲</span>
            </div>
        </section>
    );
}

