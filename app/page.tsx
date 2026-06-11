import data from "@/public/portfolio.json";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealWrapper from "@/components/RevealWrapper";

export default function Home() {
  return (
    <RevealWrapper>
      <main className="p-root">
        <Nav profile={data.profile} />
        <Hero profile={data.profile} />
        <About profile={data.profile} stats={data.stats} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects projects={data.projects} />
        <Education education={data.education} />
        <Contact profile={data.profile} />
        <Footer name={data.profile.name} />
      </main>
    </RevealWrapper>
  );
}
