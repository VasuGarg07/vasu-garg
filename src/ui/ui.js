import { GAP, STOPS } from '../config.js';
import { isTouch } from '../scene/stage.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '');

function buildSections({ profile: me, stats, skills, experience, projects }) {
  return [
    { kanji: '序', label: 'The gate', html: `
      <p class="eyebrow">旅の始まり · the path begins</p>
      <h1>${esc(me.name)}</h1><h2>${esc(me.title)}</h2><p>${esc(me.tagline)}</p>
      ${me.available ? '<span class="pill"><i></i>Open to work</span>' : ''}` },
    { kanji: '我', label: 'About', html: `
      <p class="eyebrow">the wanderer</p><h2>About me</h2>
      <p>${esc(me.bio)}</p><p>${esc(me.bio2)}</p>
      <div class="stats">${stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>` },
    { kanji: '技', label: 'Craft', html: `
      <p class="eyebrow">${isTouch ? 'tap the lanterns' : 'hover the lanterns'}</p><h2>Tools of the trade</h2>
      ${skills.map((s) => `<h3>${esc(s.category)}</h3><div class="chips">${s.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>`).join('')}` },
    { kanji: '歴', label: 'Journey', html: `
      <p class="eyebrow">the road so far</p><h2>Experience</h2>
      ${experience.map((e) => `<h3>${esc(e.role)} <span>· ${esc(e.company)}</span></h3><p class="meta">${esc(e.period)}</p><ul>${e.highlights.slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`).join('')}` },
    { kanji: '作', label: 'Works', html: `
      <p class="eyebrow">ema wall</p><h2>Things I've built</h2>
      <p>Each wooden plaque is a project. ${isTouch ? 'Tap one' : 'Click one'}, or pick from the list.</p>
      <div class="projs">${projects.map((p, i) => `<button class="proj" data-i="${i}">${esc(p.name)}</button>`).join('')}</div>` },
    { kanji: '結', label: 'Contact', html: `
      <p class="eyebrow">make a wish</p><h2>Let's talk</h2>
      <p>Ring the bell, or reach out directly. I read everything.</p>
      <div class="btns">
        <a class="btn solid" href="mailto:${esc(me.email)}">${esc(me.email)}</a>
        <a class="btn" href="${esc(me.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn" href="${esc(me.github)}" target="_blank" rel="noopener">GitHub</a>
        <a class="btn" href="${esc(asset(me.cv))}" target="_blank" rel="noopener">Résumé</a>
      </div>` },
  ];
}

export function createUi(data, state) {
  const { profile: me, projects } = data;
  const sections = buildSections(data);
  const tip = $('tip');
  const hint = $('hintbar');
  const kanji = $('kanji');
  let modalOpen = false;

  $('brand').innerHTML = `${esc(me.name.toUpperCase())}<small>${esc(me.title)}</small>`;
  hint.textContent = isTouch ? 'Swipe up to walk the path' : 'Scroll · ↑ ↓ to walk the path';

  sections.forEach((s, i) => {
    s.el = document.createElement('section');
    s.el.className = 'card';
    s.el.innerHTML = s.html;
    $('cards').appendChild(s.el);

    s.dot = document.createElement('button');
    s.dot.setAttribute('aria-label', s.label);
    s.dot.innerHTML = `<span>${s.label}</span>`;
    s.dot.addEventListener('click', () => {
      state.target = i * GAP;
      state.idle = 0;
      hideHint();
    });
    $('dots').appendChild(s.dot);
  });

  $('cards').addEventListener('click', (e) => {
    const btn = e.target.closest('.proj');
    if (btn) openProject(projects[+btn.dataset.i]);
  });

  function hideHint() {
    hint.style.opacity = 0;
  }

  function openProject(p) {
    modalOpen = true;
    hideTip();
    $('sheet').innerHTML = `
      <p class="meta">${esc(p.company)} · ${p.type === 'work' ? 'Professional' : 'Personal'}</p>
      <h2>${esc(p.name)}</h2><p>${esc(p.description)}</p>
      <ul>${(p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="btns">
        ${p.live ? `<a class="btn solid" href="${esc(p.live)}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
        ${p.github ? `<a class="btn" href="${esc(p.github)}" target="_blank" rel="noopener">Source ↗</a>` : ''}
        ${!p.live && !p.github ? '<span class="btn">Internal project — ask me about it</span>' : ''}
      </div>`;
    $('modal').classList.add('open');
  }

  function closeModal() {
    modalOpen = false;
    $('modal').classList.remove('open');
  }
  $('close').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });

  function showTip(html, x, y) {
    tip.innerHTML = html;
    if (x !== undefined) moveTip(x, y);
    tip.style.opacity = 1;
  }
  function moveTip(x, y) {
    tip.style.left = clamp(x + 16, 8, innerWidth - 288) + 'px';
    tip.style.top = clamp(y + 16, 8, innerHeight - 90) + 'px';
  }
  function hideTip() {
    tip.style.opacity = 0;
  }

  function tipFor(item) {
    if (item.type === 'skill') return `<b>${esc(item.skill.category)}</b><br>${esc(item.skill.items.join(' · '))}`;
    if (item.type === 'ema') return `<b>${esc(item.project.name)}</b><br>${isTouch ? 'Tap' : 'Click'} to open`;
    return `<b>鈴 The bell</b><br>${isTouch ? 'Tap' : 'Click'} to ring it`;
  }

  let shown = -1;
  let settled = null;

  function update(pos) {
    const near = clamp(Math.round(pos / GAP), 0, STOPS - 1);
    const here = Math.abs(pos - near * GAP) < 4;
    if (near !== shown) {
      sections.forEach((s, i) => s.dot.classList.toggle('on', i === near));
      kanji.textContent = sections[near].kanji;
    }
    if (near !== shown || here !== settled) {
      sections.forEach((s, i) => s.el.classList.toggle('on', here && i === near));
      kanji.classList.toggle('on', here);
      shown = near;
      settled = here;
    }
  }

  return { update, openProject, closeModal, isModalOpen: () => modalOpen, showTip, moveTip, hideTip, tipFor, hideHint };
}
