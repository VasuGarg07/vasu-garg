import { MdEmail, MdDownload } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact({ profile }: { profile: any }) {
  return (
    <section id="contact" className="d-section section-reveal">
      <div className="d-container">
        <div className="d-sec-head">
          <div className="d-sec-tag">Get in touch</div>
          <div className="d-sec-title">Let's Work Together</div>
        </div>
        <div className="d-contact-box">
          <h3>Drop me a message 👋</h3>
          <p>Whether it's a project, collaboration, or just a hello — my inbox is always open.</p>
          <div className="d-contact__links">
            <a href={`mailto:${profile.email}`} className="d-contact__link">
              <MdEmail size={18} color="#EA4335" /><span>Email</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener" className="d-contact__link">
              <FaLinkedin size={17} color="#0A66C2" /><span>LinkedIn</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener" className="d-contact__link">
              <FaGithub size={17} color="#fff" /><span>GitHub</span>
            </a>
            <a href={profile.cv} download className="d-contact__link">
              <MdDownload size={18} color="#00b4d8" /><span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
