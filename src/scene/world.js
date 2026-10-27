import * as THREE from 'three';
import { GAP } from '../config.js';
import { add, cyl, box, HALF } from './util.js';
import { red, ink, stone, wood, glow, blossom } from './materials.js';

export function torii(scale = 1) {
  const g = new THREE.Group();
  [-2.4, 2.4].forEach((x) => {
    add(g, cyl(0.28, 0.34, 6), red, x, 3, 0);
    add(g, cyl(0.38, 0.4, 0.7), ink, x, 0.35, 0);
  });
  add(g, box(5.6, 0.3, 0.4), red, 0, 4.7, 0);
  add(g, box(0.3, 1.0, 0.3), ink, 0, 5.3, 0);
  add(g, box(8.0, 0.22, 0.8), ink, 0, 6.0, 0);
  add(g, box(7.2, 0.4, 0.62), red, 0, 6.3, 0);
  [-1, 1].forEach((side) => {
    add(g, box(1.6, 0.4, 0.62), red, side * 3.9, 6.5, 0).rotation.z = side * 0.28;
  });
  g.scale.setScalar(scale);
  return g;
}

export function toro() {
  const g = new THREE.Group();
  add(g, cyl(0.4, 0.5, 0.3), stone, 0, 0.15, 0);
  add(g, cyl(0.13, 0.16, 1.0), stone, 0, 0.8, 0);
  add(g, cyl(0.4, 0.3, 0.15), stone, 0, 1.35, 0);
  add(g, box(0.62, 0.55, 0.62), glow, 0, 1.7, 0);
  add(g, new THREE.ConeGeometry(0.62, 0.5, 4), stone, 0, 2.2, 0).rotation.y = Math.PI / 4;
  add(g, new THREE.SphereGeometry(0.1, 8, 6), stone, 0, 2.52, 0);
  return g;
}

function tree() {
  const g = new THREE.Group();
  add(g, cyl(0.22, 0.38, 3.2, 8), wood, 0, 1.6, 0);
  for (let i = 0; i < 6; i++) {
    add(g, new THREE.IcosahedronGeometry(1.1 + Math.random(), 1), blossom, (Math.random() - 0.5) * 3.2, 3.6 + Math.random() * 1.8, (Math.random() - 0.5) * 3.2);
  }
  return g;
}

function slabs() {
  const count = 150;
  const mesh = new THREE.InstancedMesh(box(1.7, 0.1, 1.0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), count * 2);
  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  let n = 0;
  for (let k = 0; k < count; k++) {
    [-1, 1].forEach((side) => {
      quat.setFromEuler(new THREE.Euler(0, (Math.random() - 0.5) * 0.06, 0));
      matrix.compose(new THREE.Vector3(side * 0.95, 0.05, 6 - k * 1.15), quat, one);
      mesh.setMatrixAt(n, matrix);
      mesh.setColorAt(n, new THREE.Color().setHSL(0.72, 0.06, 0.26 + Math.random() * 0.12));
      n++;
    });
  }
  return mesh;
}

const skipGate = (k) => k === 0 || k === 4 || k === 8;

export function createWorld(scene) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ color: 0x172321, roughness: 1 }));
  ground.rotation.x = -HALF;
  ground.position.z = -80;
  const gravel = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 190), new THREE.MeshStandardMaterial({ color: 0x2c2a34, roughness: 1 }));
  gravel.rotation.x = -HALF;
  gravel.position.set(0, 0.01, -80);
  scene.add(ground, gravel, slabs());

  for (let k = 0; k < 10; k++) {
    if (skipGate(k)) continue;
    const gate = torii();
    gate.position.z = -(GAP / 2) * k - GAP * 0.375;
    scene.add(gate);
  }

  for (let k = 0; k < 10; k++) {
    [-3.7, 3.7].forEach((x) => {
      const lantern = toro();
      lantern.position.set(x, 0, -(GAP / 2) * k - GAP / 2);
      lantern.rotation.y = x > 0 ? -HALF : HALF;
      scene.add(lantern);
    });
  }

  for (let k = 0; k < 14; k++) {
    [-1, 1].forEach((side) => {
      const t = tree();
      t.position.set(side * (8 + Math.random() * 6), 0, -k * 10 - Math.random() * 6 + 4);
      t.scale.setScalar(0.9 + Math.random() * 0.5);
      scene.add(t);
    });
  }
}
