import { MdEmail, MdDownload } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact({ profile }: { profile: any }) {
  return (
    <section id="contact" className="nb-section">
      <div className="nb-container">
        <div className="nb-sec-head nb-sec-head--center">
          <span className="nb-page-label">LAST PAGE · CONTACT</span>
          <h2 className="nb-sec-title">Leave a note <mark>in the margins</mark></h2>
        </div>
        <div className="nb-card nb-contact-box nb-tape">
          <h3>say hello ✎</h3>
          <p>Got a project in mind, a role to fill, or just want to compare notes? I&rsquo;d love to hear from you.</p>
          <div className="nb-contact-links">
            <a href={`mailto:${profile.email}`} className="nb-c-link">
              <MdEmail size={19} color="#b3552d" />
              <span>Email</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener" className="nb-c-link">
              <FaLinkedin size={17} color="#0A66C2" />
              <span>LinkedIn</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener" className="nb-c-link">
              <FaGithub size={17} color="#181717" />
              <span>GitHub</span>
            </a>
            <a href={profile.cv} download className="nb-c-link">
              <MdDownload size={19} color="#2f7a45" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
