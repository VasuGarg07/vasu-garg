import "@/styles/minimal.css";
import Nav        from "@/components/minimal/Nav";
import Hero       from "@/components/minimal/Hero";
import About      from "@/components/minimal/About";
import Projects   from "@/components/minimal/Projects";
import Skills     from "@/components/minimal/Skills";
import Experience from "@/components/minimal/Experience";
import Education  from "@/components/minimal/Education";
import Contact    from "@/components/minimal/Contact";
import Footer     from "@/components/minimal/Footer";
import RevealWrapper from "@/components/RevealWrapper";
import data       from "@/data/portfolio.json";

export default function MinimalTheme() {
  return (
    <RevealWrapper>
      <div className="m-root">
        <Nav        profile={data.profile} />
        <Hero       profile={data.profile} />
        <About      profile={data.profile} stats={data.stats} />
        <Projects   projects={data.projects} />
        <Skills     skills={data.skills} />
        <Experience experience={data.experience} />
        <Education  education={data.education} />
        <Contact    profile={data.profile} />
        <Footer     name={data.profile.name} />
      </div>
    </RevealWrapper>
  );
}