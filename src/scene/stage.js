import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export const isTouch = matchMedia('(pointer: coarse)').matches;

export function createStage(noAO) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.prepend(renderer.domElement);
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b0d12');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.22;
  scene.add(new THREE.HemisphereLight('#8b9bbf', '#2a211a', 0.35));

  const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 40);

  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));

  let gtao = null;
  if (!isTouch) {
    gtao = new GTAOPass(scene, camera, 1, 1);
    gtao.updateGtaoMaterial({ radius: 0.18, distanceExponent: 1.2, thickness: 1, scale: 1.1, samples: 16 });
    gtao.blendIntensity = 0.85;
    gtao.render = function (...args) {
      noAO.forEach((o) => (o.visible = false));
      GTAOPass.prototype.render.apply(this, args);
      noAO.forEach((o) => (o.visible = true));
    };
    composer.addPass(gtao);
  }

  let outline = null;
  if (!isTouch) {
    outline = new OutlinePass(new THREE.Vector2(1, 1), scene, camera);
    Object.assign(outline, { edgeStrength: 2.2, edgeThickness: 1, edgeGlow: 0 });
    outline.visibleEdgeColor.set('#ffe2b8');
    outline.hiddenEdgeColor.set('#000000');
    composer.addPass(outline);
  }

  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.5, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let quality = 0;
  function fit() {
    const dpr = Math.min(devicePixelRatio, quality >= 2 ? 1 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight);
    composer.setPixelRatio(dpr);
    composer.setSize(innerWidth, innerHeight);
  }
  fit();
  addEventListener('resize', fit);

  function lowerQuality() {
    quality++;
    if (gtao) gtao.enabled = false;
    if (quality >= 2) fit();
    return quality;
  }

  return { renderer, scene, camera, composer, outline, lowerQuality };
}
