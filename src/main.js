import './style.css';
import data from './data/portfolio.json';
import { skillIcon, icon, logoMark } from './icons.js';

const { profile: me, stats, skills, experience, projects, education } = data;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '');
const ext = (href, text, cls, iconName = 'arrow') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${iconName === 'arrow' ? '' : icon(iconName)}${text}${iconName === 'arrow' ? icon('arrow', 14) : ''}</a>`;
const tags = (items) => `<div class="tags">${items.map((t) => `<span>${esc(t)}</span>`).join('')}</div>`;
const heading = (n, title) => `<div class="heading"><span class="num">${n}</span><h2>${title}</h2></div>`;

const words = me.tagline.split(' ');
const tagline = `${esc(words.slice(0, -3).join(' '))} <span class="accent">${esc(words.slice(-3).join(' '))}</span>`;
const work = projects.filter((p) => p.type === 'work');
const personal = projects.filter((p) => p.type !== 'work');

const header = `
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="#top">${logoMark(42)}<span><b>${esc(me.name)}</b><small>Full stack engineer</small></span></a>
    <nav aria-label="Sections" class="nav">
      <a href="#skills">Skills</a>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </nav>
    ${ext(asset(me.cv), 'CV', 'btn-dark')}
  </div>
</header>`;

const hero = `
<section id="top" class="hero">
  <div class="wrap hero-row">
    <div class="hero-copy">
      ${me.available ? '<span class="badge open"><i></i>Open to new opportunities</span>' : ''}
      <h1>${tagline}</h1>
      <p class="lead">${esc(me.bio)}</p>
      <div class="actions">
        <a class="btn-primary" href="mailto:${esc(me.email)}">Get in touch</a>
        <a class="btn-outline" href="#projects">See my work</a>
        <span class="divider" aria-hidden="true"></span>
        <a class="btn-icon" href="${esc(me.github)}" target="_blank" rel="noopener" aria-label="GitHub">${icon('github', 20)}</a>
        <a class="btn-icon" href="${esc(me.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin', 20)}</a>
      </div>
    </div>
    <div class="id-card">
      <img src="${esc(asset(me.profile_image))}" alt="Portrait of ${esc(me.name)}" width="400" height="320">
      <dl>
        <div><dt>Role</dt><dd>${esc(me.title)}</dd></div>
        <div><dt>Based in</dt><dd>${esc(me.location)}</dd></div>
        <div><dt>Experience</dt><dd>${esc(stats[0].value)} years</dd></div>
        <div><dt>Domains</dt><dd>${esc(me.domains)}</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="stats" aria-label="Key numbers">
  <div class="wrap stats-row">
    ${stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}
  </div>
</section>`;

const skillsSection = `
<section id="skills" class="wrap section">
  ${heading('01', 'Skills')}
  ${skills
    .map(
      (g) => `
  <div class="skill-row">
    <h3>${esc(g.category)}</h3>
    <ul class="chips">${g.items.map((name) => `<li>${skillIcon(name)}${esc(name)}</li>`).join('')}</ul>
  </div>`,
    )
    .join('')}
</section>`;

const orgRow = (logo, name, period, location) => `
    <div class="job-meta">
      <img class="org-logo" src="${esc(asset(logo))}" alt="${esc(name)} logo" width="56" height="56" loading="lazy">
      <b>${esc(name)}</b>
      <span class="mono">${esc(period)}</span>
      <span class="muted">${esc(location)}</span>
    </div>`;

const experienceSection = `
<section id="experience" class="wrap section">
  ${heading('02', 'Experience')}
  ${experience
    .map(
      (e) => `
  <article class="job">
    ${orgRow(e.logo, e.company, e.period, e.location)}
    <div class="job-body">
      <div class="job-title"><h3>${esc(e.role)}</h3>${e.current ? '<span class="tag-current">Current</span>' : ''}</div>
      <ul>${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>
  </article>`,
    )
    .join('')}
  ${education
    .map(
      (ed) => `
  <article class="job">
    ${orgRow(ed.logo, ed.institution, ed.period, ed.location)}
    <div class="job-body">
      <span class="mono">Education</span>
      <h3>${esc(ed.degree)}</h3>
    </div>
  </article>`,
    )
    .join('')}
</section>`;

const projectsSection = `
<section id="projects" class="wrap section">
  ${heading('03', 'Selected projects')}
  <p class="group-label">Professional work</p>
  <div class="cards">
    ${work
      .map(
        (p) => `
    <article class="card">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      ${tags(p.stack)}
    </article>`,
      )
      .join('')}
  </div>
  <p class="group-label">Side projects, live and open source</p>
  <div class="cards">
    ${personal
      .map(
        (p) => `
    <article class="card feature">
      ${p.image ? `<img src="${esc(asset(p.image))}" alt="${esc(p.name)} screenshot" loading="lazy" width="640" height="360">` : ''}
      <div class="feature-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        ${tags(p.stack)}
        <div class="actions">
          ${p.live ? ext(p.live, 'Live site', 'btn-primary small') : ''}
          ${p.github ? ext(p.github, 'Source', 'btn-outline small') : ''}
        </div>
      </div>
    </article>`,
      )
      .join('')}
  </div>
</section>`;

const contactSection = `
<section id="contact" class="contact">
  <div class="wrap">
    <span class="mono dim">04 / Contact</span>
    <h2>Let's build something <span class="accent-light">great.</span></h2>
    <p>${me.available ? "I'm open to senior full-stack roles and interesting problems. The fastest way to reach me is email." : "I'm always happy to talk about engineering, side projects, and interesting problems. Feel free to connect via Email or LinkedIn."}</p>
    <div class="actions">
      <a class="btn-primary" href="mailto:${esc(me.email)}">${icon('mail')}${esc(me.email)}</a>
      ${ext(me.linkedin, 'LinkedIn', 'btn-ghost', 'linkedin')}
      ${ext(me.github, 'GitHub', 'btn-ghost', 'github')}
      ${ext(asset(me.cv), 'CV (PDF)', 'btn-ghost', 'file')}
    </div>
    <footer class="footer">
      <a class="brand light" href="#top">${logoMark(34, true)}<b>${esc(me.name)}</b></a>
      <span class="mono dim">${icon('pin', 14)}${esc(me.location)}</span>
    </footer>
  </div>
</section>`;

document.getElementById('app').innerHTML = header + `<main>${hero}${skillsSection}${experienceSection}${projectsSection}</main>` + contactSection;
