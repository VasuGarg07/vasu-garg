import { ORDER, buildSections, esc, asset } from './content.js';

const $ = (id) => document.getElementById(id);
export const sideMedia = matchMedia('(min-width: 860px) and (min-aspect-ratio: 1/1)');

export function createUi(data, { go }) {
  const sections = buildSections(data);
  const panel = $('panel');
  const body = $('panel-body');
  const tip = $('tip');
  const hint = $('hint');
  const markers = {};
  let current = null;

  if (matchMedia('(pointer: coarse)').matches) hint.textContent = 'Tap a glowing dot to explore';
  $('brand').innerHTML = `${esc(data.profile.name)}<small>${esc(data.profile.title)}</small>`;
  $('brand').addEventListener('click', () => go(null));

  const navButtons = ORDER.map((id) => {
    const b = document.createElement('button');
    b.textContent = sections[id].label;
    b.addEventListener('click', () => go(current === id ? null : id));
    $('nav').appendChild(b);
    return b;
  });
  const cv = document.createElement('a');
  cv.className = 'cv';
  cv.href = asset(data.profile.cv);
  cv.target = '_blank';
  cv.rel = 'noopener';
  cv.textContent = 'Résumé';
  $('nav').appendChild(cv);

  $('close').addEventListener('click', () => go(null));
  const step = (d) => go(ORDER[(ORDER.indexOf(current) + d + ORDER.length) % ORDER.length]);
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) go(null);
    if (current && e.key === 'ArrowRight') step(1);
    if (current && e.key === 'ArrowLeft') step(-1);
  });

  function show(id) {
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
  }

  function hide() {
    current = null;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    navButtons.forEach((b) => b.classList.remove('on'));
    document.body.classList.remove('focused');
  }

  function panelSize() {
    return sideMedia.matches ? panel.offsetWidth + 40 : panel.offsetHeight;
  }

  function addMarker(id, label) {
    const b = document.createElement('button');
    b.className = 'marker';
    b.innerHTML = `<i></i><span>${esc(label)}</span>`;
    b.addEventListener('click', () => go(id));
    $('markers').appendChild(b);
    markers[id] = b;
  }

  function placeMarker(id, x, y, visible) {
    const m = markers[id];
    m.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    m.classList.toggle('off', !visible);
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

  return { show, hide, panelSize, addMarker, placeMarker, showTip, hideTip, hideHint, flat, isOpen: () => current !== null };
}
