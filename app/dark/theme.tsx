import "@/styles/dark.css";
import Nav        from "@/components/dark/Nav";
import Hero       from "@/components/dark/Hero";
import About      from "@/components/dark/About";
import Projects   from "@/components/dark/Projects";
import Skills     from "@/components/dark/Skills";
import Experience from "@/components/dark/Experience";
import Education  from "@/components/dark/Education";
import Contact    from "@/components/dark/Contact";
import Footer     from "@/components/dark/Footer";
import RevealWrapper from "@/components/RevealWrapper";
import data       from "@/data/portfolio.json";

export default function DarkTheme() {
  return (
    <RevealWrapper>
      <div className="d-root">
        {/* Background blobs */}
        <div className="d-blob d-blob1" aria-hidden="true" />
        <div className="d-blob d-blob2" aria-hidden="true" />
        <div className="d-blob d-blob3" aria-hidden="true" />

        <Nav        profile={data.profile} />
        <Hero       profile={data.profile} />
        <About      profile={data.profile} stats={data.stats} />
        <Skills     skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects   projects={data.projects} />
        <Education  education={data.education} />
        <Contact    profile={data.profile} />
        <Footer     name={data.profile.name} />
      </div>
    </RevealWrapper>
  );
}