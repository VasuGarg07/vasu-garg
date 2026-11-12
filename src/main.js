import './style.css';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import data from './data/portfolio.json';
import { createStage, isTouch } from './scene/stage.js';
import { createIsland, createClouds } from './scene/island.js';
import { createCity } from './scene/city.js';
import { SANS, MONO } from './scene/textures.js';
import { createUi, sideMedia } from './ui/ui.js';
import { ORDER, asset } from './ui/content.js';

CameraControls.install({ THREE });

const OVERVIEW = { target: new THREE.Vector3(0, -1.6, 0), dir: new THREE.Vector3(1, 0.88, 1).normalize(), size: [12, 10] };
const OVERVIEW_TALL = { target: new THREE.Vector3(0, -0.8, 0), dir: new THREE.Vector3(1, 1.75, 1).normalize(), size: [10.9, 10.4] };
const loader = document.getElementById('loader');
const header = document.getElementById('top');

let navigate = () => {};
const ui = createUi(data, { go: (id, item) => navigate(id, item) });

function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => loader.remove(), 800);
}

async function loadFonts() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load(`700 30px ${SANS}`), document.fonts.load(`500 16px ${MONO}`)]),
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
  const { renderer, scene, camera, composer, labels, lowerQuality } = stage;
  createIsland(scene);
  const city = createCity(scene, data, noAO, asset(data.profile.profile_image));
  const spots = [];
  scene.traverse((o) => {
    if (o.userData.hotspot) spots.push(o);
    if (!o.isMesh) return;
    o.castShadow = !noAO.includes(o);
    o.receiveShadow = true;
  });
  const moveClouds = createClouds(scene);

  ORDER.forEach((id) => {
    const label = new CSS2DObject(ui.label(id, city.views[id].label));
    label.position.copy(city.views[id].anchor);
    scene.add(label);
  });

  const controls = new CameraControls(camera, renderer.domElement);
  controls.smoothTime = 0.5;
  controls.draggingSmoothTime = 0.15;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = 1.32;
  controls.minDistance = 6;
  controls.maxDistance = 170;
  controls.dollySpeed = 0.5;
  controls.mouseButtons.right = CameraControls.ACTION.NONE;
  controls.mouseButtons.middle = CameraControls.ACTION.NONE;
  controls.touches.two = CameraControls.ACTION.TOUCH_DOLLY;
  controls.touches.three = CameraControls.ACTION.NONE;

  let active = null;
  let dragging = false;
  const offset = new THREE.Vector2();
  const goalOffset = new THREE.Vector2();

  function applyView(transition) {
    const w = innerWidth;
    const h = innerHeight;
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 32 : 25;
    const view = active ? city.views[active] : w / h < 1 ? OVERVIEW_TALL : OVERVIEW;
    const side = sideMedia.matches;
    const size = active ? ui.panelSize() : 0;
    const bottom = side ? 0 : size;
    const top = header.offsetHeight + (active ? 0 : 30);
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const dist = (h / tv) * Math.max(view.size[0] / (side ? w - size : w), view.size[1] / (h - bottom - top));
    const p = view.target.clone().addScaledVector(view.dir, dist);
    controls.normalizeRotations();
    controls.setLookAt(p.x, p.y, p.z, view.target.x, view.target.y, view.target.z, transition);
    goalOffset.set(side ? size / 2 : 0, (bottom - top) / 2);
  }

  navigate = (id, item) => {
    active = city.views[id] ? id : null;
    if (active) ui.show(active, item);
    else ui.hide();
    applyView(true);
    history.replaceState(null, '', active ? `#${active}` : location.pathname + location.search);
  };

  applyView(false);
  controls.rotate(-0.9, -0.12, false);
  controls.dolly(-22, false);
  controls.update(0);
  const initial = location.hash.slice(1);
  if (ORDER.includes(initial)) navigate(initial);
  else applyView(true);
  addEventListener('resize', () => applyView(true));

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pointerAt = null;
  let pressAt = null;
  let fingers = 0;
  let hovered = null;

  function pick(x, y) {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    let o = raycaster.intersectObject(scene, true)[0]?.object;
    while (o && !o.userData.hotspot) o = o.parent;
    return o ? o.userData.hotspot : null;
  }

  controls.addEventListener('controlstart', () => {
    dragging = true;
    ui.hideHint();
  });
  controls.addEventListener('controlend', () => (dragging = false));
  addEventListener('pointermove', (e) => {
    pointerAt = e.pointerType === 'mouse' && e.target === renderer.domElement ? [e.clientX, e.clientY] : null;
  });
  renderer.domElement.addEventListener('pointerdown', (e) => {
    fingers++;
    pressAt = fingers === 1 ? [e.clientX, e.clientY] : null;
  });
  renderer.domElement.addEventListener('pointercancel', () => {
    fingers = 0;
    pressAt = null;
  });
  renderer.domElement.addEventListener('pointerup', (e) => {
    fingers = Math.max(0, fingers - 1);
    const press = pressAt;
    pressAt = null;
    if (!press || Math.hypot(e.clientX - press[0], e.clientY - press[1]) > (e.pointerType === 'mouse' ? 6 : 12)) return;
    const spot = pick(e.clientX, e.clientY);
    if (spot) navigate(spot.id, spot.item);
    else if (active) navigate(null);
  });

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

    controls.update(dt);
    offset.lerp(goalOffset, 1 - Math.exp(-dt * 4));
    camera.setViewOffset(innerWidth, innerHeight, offset.x, offset.y, innerWidth, innerHeight);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    if (!isTouch) {
      const spot = pointerAt && !dragging ? pick(...pointerAt) : null;
      hovered = spot ? spot.object : null;
      renderer.domElement.style.cursor = spot ? 'pointer' : '';
      if (spot) ui.showTip(`${spot.label} · click to open`, ...pointerAt);
      else ui.hideTip();
    }
    spots.forEach((o) => o.scale.setScalar(THREE.MathUtils.damp(o.scale.x, o === hovered ? 1.07 : 1, 12, dt)));

    city.update(dt, time);
    moveClouds(time);
    composer.render();
    labels.render(scene, camera);
    if (++frames === 3) hideLoader();
  }
  requestAnimationFrame(frame);
}

start();
