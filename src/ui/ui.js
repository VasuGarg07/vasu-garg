import { ORDER, buildSections, esc, asset } from './content.js';

const $ = (id) => document.getElementById(id);
export const sideMedia = matchMedia('(min-width: 540px) and (min-aspect-ratio: 1/1)');

export function createUi(data, { go }) {
  const sections = buildSections(data);
  const panel = $('panel');
  const body = $('panel-body');
  const tip = $('tip');
  const hint = $('hint');
  let current = null;

  if (matchMedia('(pointer: coarse)').matches) hint.textContent = 'Drag to look around · tap a building to explore';
  $('brand').innerHTML = `${esc(data.profile.name)}<small>${esc(data.profile.title)}</small>`;
  $('brand').addEventListener('click', () => go(null));

  const navButtons = ORDER.map((id) => {
    const b = document.createElement('button');
    b.textContent = sections[id].label;
    b.addEventListener('click', () => go(current === id ? null : id));
    $('nav').appendChild(b);
    return b;
  });
  $('cv').href = asset(data.profile.cv);

  $('close').addEventListener('click', () => go(null));
  const step = (d) => go(ORDER[(ORDER.indexOf(current) + d + ORDER.length) % ORDER.length]);
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) go(null);
    if (current && e.key === 'ArrowRight') step(1);
    if (current && e.key === 'ArrowLeft') step(-1);
  });

  function show(id, item) {
    if (current !== id) {
      const i = ORDER.indexOf(id);
      const prev = sections[ORDER[(i + ORDER.length - 1) % ORDER.length]];
      const next = sections[ORDER[(i + 1) % ORDER.length]];
      $('panel-kicker').textContent = `${String(i + 1).padStart(2, '0')} / ${sections[id].object}`;
      body.innerHTML = sections[id].html;
      body.scrollTop = 0;
      $('prev').textContent = `← ${prev.label}`;
      $('next').textContent = `${next.label} →`;
    }
    current = id;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    navButtons.forEach((b, i) => b.classList.toggle('on', ORDER[i] === id));
    document.body.classList.add('focused');
    hideHint();

    body.querySelector('.hit')?.classList.remove('hit');
    const target = item == null ? null : body.querySelector(`[data-item="${item}"]`);
    if (target) {
      target.classList.add('hit');
      body.scrollTop = target.offsetTop - 12;
    }
  }

  function hide() {
    current = null;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    navButtons.forEach((b) => b.classList.remove('on'));
    document.body.classList.remove('focused');
  }

  function panelSize() {
    return sideMedia.matches ? innerWidth - panel.offsetLeft + 20 : panel.offsetHeight;
  }

  function label(id, text) {
    const b = document.createElement('button');
    b.className = 'spot';
    b.textContent = text;
    b.addEventListener('click', () => go(id));
    return b;
  }

  function showTip(text, x, y) {
    tip.textContent = text;
    tip.style.transform = `translate(${Math.min(x + 16, innerWidth - tip.offsetWidth - 12)}px, ${y + 18}px)`;
    tip.classList.add('on');
  }

  function hideTip() {
    tip.classList.remove('on');
  }

  function hideHint() {
    hint.classList.add('gone');
  }

  function flat() {
    document.body.classList.add('flat');
    body.innerHTML = ORDER.map((id) => `<section id="s-${id}">${sections[id].html}</section>`).join('');
    navButtons.forEach((b, i) => b.addEventListener('click', () => $(`s-${ORDER[i]}`).scrollIntoView({ behavior: 'smooth' })));
  }

  return { show, hide, panelSize, label, showTip, hideTip, hideHint, flat };
}
