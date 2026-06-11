import { MdEmail, MdDownload } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Contact({ profile }: { profile: any }) {
  return (
    <section id="contact" className="p-section">
      <div className="p-container">
        <div className="p-sec-head p-sec-head--center">
          <span className="p-tag p-tag--pink">Contact</span>
          <h2 className="p-sec-title">Let's build something! 🚀</h2>
        </div>
        <div className="p-contact-box">
          <h3>Say hello 👋</h3>
          <p>Got a project in mind or just want to connect? I'd love to hear from you!</p>
          <div className="p-contact-links">
            <a href={`mailto:${profile.email}`} className="p-c-link">
              <MdEmail size={20} color="#EA4335" />
              <span>Email</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener" className="p-c-link">
              <FaLinkedin size={18} color="#0A66C2" />
              <span>LinkedIn</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener" className="p-c-link">
              <FaGithub size={18} color="#181717" />
              <span>GitHub</span>
            </a>
            <a href={profile.cv} download className="p-c-link">
              <MdDownload size={20} color="#008b2c" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}