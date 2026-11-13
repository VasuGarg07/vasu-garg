import './style.css';
import * as THREE from 'three';
import data from './data/portfolio.json';
import { createStage, isTouch } from './scene/stage.js';
import { createRoom } from './scene/room.js';
import { createDesk } from './scene/desk.js';
import { SANS, MONO } from './scene/textures.js';
import { createUi, sideMedia } from './ui/ui.js';
import { ORDER } from './ui/content.js';

const OVERVIEW = { target: new THREE.Vector3(0.02, 1.13, -0.2), dir: new THREE.Vector3(0.55, 0.22, 1).normalize(), size: [1.38, 0.74] };
const OVERVIEW_TALL = { target: new THREE.Vector3(0.26, 1.2, -0.25), dir: new THREE.Vector3(0.95, 0.3, 1).normalize(), size: [0.82, 0.7] };
const loader = document.getElementById('loader');
const header = document.getElementById('top');

let navigate = () => {};
const ui = createUi(data, { go: (id) => navigate(id) });

function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => loader.remove(), 800);
}

async function loadFonts() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load(`600 30px ${SANS}`), document.fonts.load(`16px ${MONO}`)]),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  } catch (e) {}
}

async function start() {
  await loadFonts();

  const noAO = [];
  let stage;
  try {
    stage = createStage(noAO);
  } catch (e) {
    ui.flat();
    hideLoader();
    return;
  }
  const { renderer, scene, camera, composer, outline, lowerQuality } = stage;
  const room = createRoom(scene, data, noAO);
  const desk = createDesk(scene, data, noAO);
  const hotspots = [...room.hotspots, ...desk.hotspots];
  const byId = Object.fromEntries(hotspots.map((h) => [h.id, h]));
  hotspots.filter((h) => h.view).forEach((h) => ui.addMarker(h.id, h.label));

  scene.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = !noAO.includes(o);
    o.receiveShadow = true;
  });

  let active = null;
  navigate = (id) => {
    active = id && byId[id] ? id : null;
    if (active) ui.show(active);
    else ui.hide();
    history.replaceState(null, '', active ? `#${active}` : location.pathname + location.search);
  };

  const goal = { target: new THREE.Vector3(), pos: new THREE.Vector3(), off: new THREE.Vector2() };
  const cur = { target: new THREE.Vector3(), pos: new THREE.Vector3(), off: new THREE.Vector2() };

  function solveGoal() {
    const w = innerWidth;
    const h = innerHeight;
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 50 : 38;
    const view = active ? byId[active].view : w / h < 1 ? OVERVIEW_TALL : OVERVIEW;
    const side = sideMedia.matches;
    const size = active ? ui.panelSize() : 0;
    const bottom = side ? 0 : size;
    const top = header.offsetHeight;
    const freeW = side ? w - size : w;
    const freeH = h - bottom - top;
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const dist = (h / tv) * Math.max(view.size[0] / freeW, view.size[1] / freeH);
    goal.target.copy(view.target);
    goal.pos.copy(view.target).addScaledVector(view.dir, dist);
    goal.off.set(side ? size / 2 : 0, (bottom - top) / 2);
  }

  solveGoal();
  cur.target.copy(goal.target);
  cur.pos.copy(goal.pos).sub(goal.target).multiplyScalar(1.7).add(goal.target);
  cur.pos.y += 0.4;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  const parallax = new THREE.Vector2();
  let pointerAt = null;
  let hovered = null;

  function pick(x, y) {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    let o = raycaster.intersectObject(scene, true)[0]?.object;
    while (o && !o.userData.hotspot) o = o.parent;
    return o ? o.userData.hotspot : null;
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    pointerAt = e.target === renderer.domElement ? [e.clientX, e.clientY] : null;
  });

  renderer.domElement.addEventListener('click', (e) => {
    const id = pick(e.clientX, e.clientY);
    ui.hideHint();
    if (id === 'lamp') desk.toggleLamp();
    else if (id || active) navigate(id);
  });

  const initial = location.hash.slice(1);
  if (ORDER.includes(initial)) navigate(initial);

  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const v = new THREE.Vector3();
  const born = performance.now();
  let last = born;
  let time = 0;
  let frames = 0;
  let sample = { t: 0, n: 0 };
  let level = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    const raw = (now - last) / 1000;
    const dt = Math.min(raw, 0.1);
    last = now;
    time += dt;

    if (now - born > 3000 && level < 2) {
      sample.t += raw;
      sample.n++;
      if (sample.t > 2) {
        if (sample.n / sample.t < 40) level = lowerQuality();
        sample = { t: 0, n: 0 };
      }
    }

    solveGoal();
    const k = 1 - Math.exp(-dt * 3.2);
    cur.target.lerp(goal.target, k);
    cur.pos.lerp(goal.pos, k);
    cur.off.lerp(goal.off, k);
    parallax.lerp(pointer, 1 - Math.exp(-dt * 3));

    camera.position.copy(cur.pos);
    camera.lookAt(cur.target);
    const amp = cur.pos.distanceTo(cur.target) * (active ? 0.012 : 0.035);
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(right, parallax.x * amp).addScaledVector(up, parallax.y * amp * 0.6);
    camera.lookAt(cur.target);
    camera.setViewOffset(innerWidth, innerHeight, cur.off.x, cur.off.y, innerWidth, innerHeight);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const settled = time > 1.6 && cur.pos.distanceTo(goal.pos) < 0.05;
    hotspots.forEach((h) => {
      if (!h.view) return;
      v.copy(h.anchor).project(camera);
      const x = ((v.x + 1) / 2) * innerWidth;
      const y = ((1 - v.y) / 2) * innerHeight;
      ui.placeMarker(h.id, x, y, !active && settled && v.z < 1 && x > 16 && x < innerWidth - 16 && y > header.offsetHeight + 8 && y < innerHeight - 16);
    });

    if (!isTouch) {
      const id = pointerAt ? pick(...pointerAt) : null;
      const next = id && id !== active ? id : null;
      if (next !== hovered) {
        hovered = next;
        outline.selectedObjects = hovered ? [byId[hovered].object] : [];
        renderer.domElement.style.cursor = hovered ? 'pointer' : '';
      }
      if (hovered) ui.showTip(hovered === 'lamp' ? 'Desk lamp · click to toggle' : `${byId[hovered].label} · click to open`, ...pointerAt);
      else ui.hideTip();
    }

    room.update();
    desk.update(dt, time);
    composer.render();
    if (++frames === 3) hideLoader();
  }
  requestAnimationFrame(frame);
}

start();
