import './style.css';
import * as THREE from 'three';
import data from './data/portfolio.json';
import { GAP, MOBILE_MAX } from './config.js';
import { createStage, isTouch } from './scene/stage.js';
import { createSky } from './scene/sky.js';
import { createWorld } from './scene/world.js';
import { createProps } from './scene/props.js';
import { createPetals } from './scene/petals.js';
import { FONTS } from './scene/util.js';
import { createUi } from './ui/ui.js';
import { bindInput } from './ui/input.js';
import { ringBell } from './audio.js';

const clamp = THREE.MathUtils.clamp;
const loader = document.getElementById('loader');

async function loadFonts() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load(`700 40px ${FONTS.serif}`), document.fonts.load(`500 20px ${FONTS.sans}`)]),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  } catch (e) {}
}

function failWithoutWebGL() {
  document.getElementById('loader-text').textContent = 'This experience needs WebGL, which is not available in this browser.';
  loader.querySelector('.torii').style.animation = 'none';
}

async function start() {
  await loadFonts();

  let stage;
  try {
    stage = createStage();
  } catch (e) {
    failWithoutWebGL();
    return;
  }
  const { renderer, scene, camera, composer, lamp, lowerQuality } = stage;

  const sky = createSky(scene);
  createWorld(scene);
  const props = createProps(scene, data);
  const updatePetals = createPetals(scene, isTouch ? 800 : 1800);

  const state = { pos: 0, target: 0, idle: 0, gust: 0, hovered: null, pointer: new THREE.Vector2(5, 5), pointerMoved: false };
  const ui = createUi(data, state);
  bindInput(state, ui);

  const narrowMedia = matchMedia(`(max-width: ${MOBILE_MAX}px), (max-aspect-ratio: 4/5)`);
  const applyLayout = () => props.setLayout(narrowMedia.matches);
  narrowMedia.addEventListener('change', applyLayout);
  applyLayout();

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(ndcPoint) {
    raycaster.setFromCamera(ndcPoint, camera);
    const hit = raycaster.intersectObjects(props.interactives, false)[0];
    return hit ? hit.object.userData.item : null;
  }

  let tipTimer = 0;
  renderer.domElement.addEventListener('click', (e) => {
    if (ui.isModalOpen()) return;
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const item = pick(ndc);
    if (!item) return;
    if (item.type === 'ema') ui.openProject(item.project);
    if (item.type === 'bell') {
      ringBell();
      state.gust = 1;
    }
    if (item.type === 'skill' && isTouch) {
      ui.showTip(ui.tipFor(item), e.clientX, e.clientY);
      clearTimeout(tipTimer);
      tipTimer = setTimeout(ui.hideTip, 2500);
    }
  });

  const look = new THREE.Vector3(0, 1.7, 0);
  const born = performance.now();
  let last = born;
  let time = 0;
  let frames = 0;
  let sampleTime = 0;
  let sampleFrames = 0;
  let level = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    const rawDt = (now - last) / 1000;
    const dt = Math.min(rawDt, 0.25);
    last = now;
    time += dt;

    if (now - born > 4000 && level < 2) {
      sampleTime += rawDt;
      sampleFrames++;
      if (sampleTime > 2) {
        if (sampleFrames / sampleTime < 30) level = lowerQuality();
        sampleTime = 0;
        sampleFrames = 0;
      }
    }
    const k = 1 - Math.exp(-dt * 4);

    state.idle += dt;
    if (state.idle > 0.8 && !ui.isModalOpen()) {
      const d = Math.round(state.target / GAP) * GAP - state.target;
      if (Math.abs(d) < 5) state.target += d * Math.min(1, dt * 2.5);
    }
    state.pos += (state.target - state.pos) * k;
    const moving = Math.abs(state.target - state.pos) > 0.05;

    const px = isTouch ? 0 : state.pointer.x;
    const py = isTouch ? 0 : state.pointer.y;
    camera.position.set(Math.sin(state.pos * 0.2) * 0.15, 1.65 + (moving ? Math.sin(state.pos * 1.4) * 0.03 : 0), -state.pos);
    look.x += (px * 2.4 - look.x) * k;
    look.y += (1.8 + clamp((state.pos - 90) / 20, 0, 1) + py * 1.3 - look.y) * k;
    camera.lookAt(look.x, look.y, -state.pos - 12);
    sky.position.copy(camera.position);
    lamp.position.set(camera.position.x, 2.4, camera.position.z - 1);

    ui.update(state.pos);

    if (!isTouch && (state.pointerMoved || moving)) {
      state.pointerMoved = false;
      const hit = ui.isModalOpen() ? null : pick(state.pointer);
      if (hit !== state.hovered) {
        state.hovered = hit;
        renderer.domElement.style.cursor = hit && hit.type !== 'skill' ? 'pointer' : 'default';
        if (hit) ui.showTip(ui.tipFor(hit));
        else ui.hideTip();
      }
    }

    state.gust = Math.max(0, state.gust - dt * 0.5);
    props.update(time, state.hovered, state.gust);
    updatePetals(dt, time, camera.position.z, state.gust);

    composer.render();
    if (++frames === 3) {
      loader.style.opacity = 0;
      setTimeout(() => loader.remove(), 900);
    }
  }
  requestAnimationFrame(frame);
}

start();
