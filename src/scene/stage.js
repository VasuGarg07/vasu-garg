import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { sky } from './textures.js';

export const isTouch = matchMedia('(pointer: coarse)').matches;

export function createStage(noAO) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  document.body.prepend(renderer.domElement);

  const labels = new CSS2DRenderer();
  labels.domElement.id = 'labels';
  renderer.domElement.after(labels.domElement);

  const scene = new THREE.Scene();
  scene.background = sky();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;
  scene.add(new THREE.HemisphereLight('#e3f0ff', '#b9d49a', 1.4));

  const sun = new THREE.DirectionalLight('#fff1dc', 3);
  sun.position.set(9, 17, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(isTouch ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  sun.shadow.radius = 4;
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(25, 1, 1, 600);

  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));

  let gtao = null;
  if (!isTouch) {
    gtao = new GTAOPass(scene, camera, 1, 1);
    gtao.updateGtaoMaterial({ radius: 0.7, distanceExponent: 1.2, thickness: 1, scale: 1.1, samples: 16 });
    gtao.blendIntensity = 0.8;
    gtao.render = function (...args) {
      noAO.forEach((o) => (o.visible = false));
      GTAOPass.prototype.render.apply(this, args);
      noAO.forEach((o) => (o.visible = true));
    };
    composer.addPass(gtao);
  }
  composer.addPass(new OutputPass());

  let quality = 0;
  function fit() {
    const dpr = Math.min(devicePixelRatio, quality >= 2 ? 1 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight);
    composer.setPixelRatio(dpr);
    composer.setSize(innerWidth, innerHeight);
    labels.setSize(innerWidth, innerHeight);
  }
  fit();
  addEventListener('resize', fit);

  function lowerQuality() {
    quality++;
    if (gtao) gtao.enabled = false;
    if (quality >= 2) fit();
    return quality;
  }

  return { renderer, scene, camera, composer, labels, lowerQuality };
}
