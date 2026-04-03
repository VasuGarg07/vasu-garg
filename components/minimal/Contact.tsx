import { MdEmail, MdDownload } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact({ profile }: { profile: any }) {
  return (
    <>
      <hr className="m-divider" />
      <section id="contact" className="m-section">
        <div className="m-container">
          <div className="m-contact__inner section-reveal">
            <div className="m-sec-eyebrow" style={{marginBottom:"1.2rem"}}>Get in touch</div>
            <h2>Let's work<br /><em>together.</em></h2>
            <p>Whether it's a new project, a collaboration, or just a conversation — I'd love to hear from you.</p>
            <div className="m-contact-list">
              <a href={`mailto:${profile.email}`} className="m-contact-item">
                <div className="m-contact-item__left"><MdEmail size={17} color="#EA4335" /><span>Email — {profile.email}</span></div>
                <span className="m-contact-item__arrow">↗</span>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener" className="m-contact-item">
                <div className="m-contact-item__left"><FaLinkedin size={16} color="#0A66C2" /><span>LinkedIn</span></div>
                <span className="m-contact-item__arrow">↗</span>
              </a>
              <a href={profile.github} target="_blank" rel="noopener" className="m-contact-item">
                <div className="m-contact-item__left"><FaGithub size={16} color="#2d2d2d" /><span>GitHub</span></div>
                <span className="m-contact-item__arrow">↗</span>
              </a>
              <a href={profile.cv} download className="m-contact-item">
                <div className="m-contact-item__left"><MdDownload size={17} color="#c0603a" /><span>Download CV</span></div>
                <span className="m-contact-item__arrow">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
