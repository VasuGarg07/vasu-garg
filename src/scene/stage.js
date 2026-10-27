import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { MOBILE_MAX } from '../config.js';

export const isTouch = matchMedia('(pointer: coarse)').matches;

export function createStage() {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  document.body.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x6b3a63, 0.017);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900);

  const moonLight = new THREE.DirectionalLight(0xaab8ff, 1.3);
  moonLight.position.set(-30, 40, 10);
  const lamp = new THREE.PointLight(0xffb36b, 45, 20, 2);
  scene.add(new THREE.HemisphereLight(0x8a7bd0, 0x1a1020, 0.9), moonLight, lamp);

  const hdr = renderer.extensions.has('EXT_color_buffer_half_float') || renderer.extensions.has('EXT_color_buffer_float');
  const target = new THREE.WebGLRenderTarget(1, 1, {
    type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType,
    samples: isTouch ? 0 : 4,
  });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), isTouch ? 0.65 : 0.8, 0.7, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let quality = 0;

  function fit() {
    const w = innerWidth;
    const h = innerHeight;
    const dpr = Math.min(devicePixelRatio, isTouch ? 1.25 : 1.5, quality >= 2 ? 1 : Infinity);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 65 : 55;
    if (w > MOBILE_MAX) camera.setViewOffset(w, h, -w * 0.14, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.12, w, h);
    camera.updateProjectionMatrix();
  }
  fit();
  addEventListener('resize', fit);

  function lowerQuality() {
    quality++;
    bloom.enabled = quality < 1;
    fit();
    return quality;
  }

  return { renderer, scene, camera, composer, lamp, lowerQuality };
}
