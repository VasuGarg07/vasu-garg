import * as THREE from 'three';
import { canvasTex } from './util.js';

export function createPetals(scene, count) {
  const sprite = canvasTex(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.5, '#ffd0e0');
    g.addColorStop(1, 'rgba(255,200,220,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });

  const pos = new Float32Array(count * 3);
  const fall = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 44;
    pos[i * 3 + 1] = Math.random() * 12;
    pos[i * 3 + 2] = -50 + Math.random() * 62;
    fall[i] = 0.4 + Math.random() * 0.7;
    phase[i] = Math.random() * 6.28;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.2, map: sprite, transparent: true, depthWrite: false, color: 0xffc3d9 }));
  points.frustumCulled = false;
  scene.add(points);

  return function update(dt, time, camZ, gust) {
    for (let i = 0; i < count; i++) {
      const j = i * 3;
      pos[j + 1] -= (fall[i] * 0.6 + gust * 1.5) * dt;
      pos[j] += (Math.sin(time * 0.8 + phase[i]) * 0.5 + gust * 2.5) * dt;
      pos[j + 2] += Math.cos(time * 0.6 + phase[i]) * 0.3 * dt;
      if (pos[j + 1] < 0) pos[j + 1] += 12;
      if (pos[j + 2] > camZ + 12) pos[j + 2] -= 62;
      if (pos[j + 2] < camZ - 50) pos[j + 2] += 62;
      if (pos[j] > 22) pos[j] -= 44;
      if (pos[j] < -22) pos[j] += 44;
    }
    geo.attributes.position.needsUpdate = true;
  };
}
