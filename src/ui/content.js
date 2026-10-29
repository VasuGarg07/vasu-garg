export const ORDER = ['about', 'experience', 'projects', 'skills', 'contact'];

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '');

const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const chips = (items) => `<div class="chips">${items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>`;
const link = (href, text, cls = 'btn') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;

export function buildSections({ profile: me, stats, skills, experience, projects, education }) {
  return {
    about: {
      label: 'About',
      object: 'Photo frame',
      html: `
        <div class="who">
          <img src="${esc(asset(me.profile_image))}" alt="${esc(me.name)}" width="88" height="88">
          <div><h2>${esc(me.name)}</h2><p class="muted">${esc(me.title)}</p><p class="muted small">${esc(me.location)}</p></div>
        </div>
        ${me.available ? '<span class="pill"><i></i>Open to new opportunities</span>' : ''}
        <p class="lead">${esc(me.tagline)}</p>
        <p>${esc(me.bio)}</p>
        <p>${esc(me.bio2)}</p>
        <div class="stats">${stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>`,
    },
    experience: {
      label: 'Experience',
      object: 'Corkboard',
      html: `
        <h2>Experience</h2>
        <ol class="timeline">${experience
          .map(
            (e) => `
          <li>
            <div class="row"><h3>${esc(e.role)}</h3>${e.current ? '<span class="badge">Current</span>' : ''}</div>
            <p class="muted small">${esc(e.company)} · ${esc(e.period)}</p>
            ${list(e.highlights)}
          </li>`,
          )
          .join('')}</ol>
        <h3 class="sub">Education</h3>
        ${education.map((e) => `<div class="edu"><b>${esc(e.degree)}</b><span class="muted small">${esc(e.institution)} · ${esc(e.period)}</span></div>`).join('')}`,
    },
    projects: {
      label: 'Projects',
      object: 'Monitor',
      html: `
        <h2>Selected projects</h2>
        ${projects
          .map(
            (p) => `
          <article class="project">
            ${p.image ? `<img src="${esc(asset(p.image))}" alt="${esc(p.name)} screenshot" loading="lazy">` : ''}
            <p class="eyebrow">${esc(p.company)} · ${p.type === 'work' ? 'Professional' : 'Personal'}</p>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.description)}</p>
            ${list(p.highlights)}
            ${chips(p.stack)}
            <div class="links">
              ${p.live ? link(p.live, 'Live site ↗', 'btn primary') : ''}
              ${p.github ? link(p.github, 'Source ↗') : ''}
              ${!p.live && !p.github ? '<span class="muted small">Internal product. Happy to walk you through it.</span>' : ''}
            </div>
          </article>`,
          )
          .join('')}`,
    },
    skills: {
      label: 'Skills',
      object: 'Bookshelf',
      html: `
        <h2>Skills</h2>
        ${skills.map((s) => `<section class="skill"><h3>${esc(s.category)}</h3>${chips(s.items)}</section>`).join('')}`,
    },
    contact: {
      label: 'Contact',
      object: 'Phone',
      html: `
        <h2>Let's talk</h2>
        <p class="lead">I'm open to senior full-stack roles and interesting problems. The fastest way to reach me is email.</p>
        <a class="btn primary wide" href="mailto:${esc(me.email)}">${esc(me.email)}</a>
        <div class="links">
          ${link(me.linkedin, 'LinkedIn ↗')}
          ${link(me.github, 'GitHub ↗')}
          ${link(asset(me.cv), 'Résumé (PDF) ↗')}
        </div>
        <p class="muted small">Based in ${esc(me.location)}.</p>`,
    },
  };
}
