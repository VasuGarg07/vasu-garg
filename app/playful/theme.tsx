import "@/styles/playful.css";
import data from "@/data/portfolio.json";
import Nav from "@/components/playful/Nav";
import Hero from "@/components/playful/Hero";
import About from "@/components/playful/About";
import Projects from "@/components/playful/Projects";
import Skills from "@/components/playful/Skills";
import Experience from "@/components/playful/Experience";
import Education from "@/components/playful/Education";
import Contact from "@/components/playful/Contact";
import Footer from "@/components/playful/Footer";
import RevealWrapper from "@/components/RevealWrapper";

export default function PlayfulPage() {
  return (
    <RevealWrapper>
      <main className="p-root">
        <Nav profile={data.profile} />
        <Hero profile={data.profile} />
        <About profile={data.profile} stats={data.stats} />
        <Projects projects={data.projects} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Education education={data.education} />
        <Contact profile={data.profile} />
        <Footer name={data.profile.name} />
      </main>
    </RevealWrapper>
  );
}


