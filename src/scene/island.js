import * as THREE from 'three';
import { HALF, ISLAND as R, ROAD, RAIL, PALETTE as C, std, cyl, v2, polar, mesh, flat, group, rng } from './kit.js';

function land(scene) {
  const cap = [[R - 0.4, -0.7], [R + 0.1, -0.55], [R + 0.12, -0.12], [R, 0], [0, 0]];
  mesh(scene, new THREE.LatheGeometry(cap.map(v2), 80), std(C.grass));

  const profile = [[0, -8.4], [1.8, -7], [4.2, -5.2], [6.8, -3.4], [8.9, -1.8], [R - 0.3, -0.6]];
  const geo = new THREE.LatheGeometry(profile.map(v2), 12);
  const pos = geo.attributes.position;
  const soil = new THREE.Color(C.soil);
  const rock = new THREE.Color(C.rock);
  const colors = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    const k = y > -1 ? 1 : 1 + (n - Math.floor(n) - 0.5) * 0.24;
    pos.setXYZ(i, x * k, y, z * k);
    const c = y > -2.2 ? soil : rock;
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  mesh(scene, geo, std('#ffffff', { vertexColors: true, flatShading: true }));
}

function roads(scene) {
  const road = std(C.road, { roughness: 0.95 });
  flat(scene, new THREE.RingGeometry(ROAD - 0.38, ROAD + 0.38, 96), road, 0, 0.012, 0);
  flat(scene, new THREE.RingGeometry(ROAD - 0.02, ROAD + 0.02, 96), std('#f6f2e8'), 0, 0.018, 0);
  [0, HALF].forEach((rz) => (flat(scene, new THREE.PlaneGeometry(ROAD * 2, 0.76), road, 0, 0.011, 0).rotation.z = rz));
  flat(scene, new THREE.CircleGeometry(1.9, 48), std(C.paving), 0, 0.022, 0);

  flat(scene, new THREE.RingGeometry(RAIL - 0.36, RAIL + 0.36, 96), std('#d6cab2'), 0, 0.012, 0);
  const steel = std('#7c8494', { metalness: 0.6, roughness: 0.4 });
  [-0.16, 0.16].forEach((d) => (mesh(scene, new THREE.TorusGeometry(RAIL + d, 0.025, 6, 160), steel, 0, 0.075, 0).rotation.x = HALF));
  const ties = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.04, 0.09), std(C.wood), 120);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * RAIL, 0.035, Math.sin(a) * RAIL);
    dummy.rotation.y = -a;
    dummy.updateMatrix();
    ties.setMatrixAt(i, dummy.matrix);
  }
  scene.add(ties);

  flat(scene, new THREE.CircleGeometry(1.3, 40), std(C.paving), 2.3, 0.012, 4);
  flat(scene, new THREE.CircleGeometry(1.15, 40), std('#8fd6ff', { roughness: 0.12, metalness: 0.1 }), 2.3, 0.016, 4);
}

function blocked(x, z) {
  const near = (cx, cz, r) => Math.hypot(x - cx, z - cz) < r;
  return (
    Math.abs(x) < 0.85 ||
    Math.abs(z) < 0.85 ||
    (x < 0 && z < 0) ||
    near(0, 0, 2.4) ||
    near(-3.3, 3.1, 2.6) ||
    near(3.5, -2.4, 3.1) ||
    near(1.3, -5, 1.2) ||
    near(2.3, 4, 1.6)
  );
}

function trees(scene, rand) {
  const trunk = std(C.wood);
  const greens = ['#5fb46a', '#7cc76c', '#4fa37a'].map((c) => std(c));
  const trunkGeo = cyl(0.06, 0.08, 0.4, 8);
  const cone = new THREE.ConeGeometry(0.34, 0.8, 9);
  const ball = new THREE.IcosahedronGeometry(0.36, 1);
  const tree = (parent, x, z, s) => {
    const g = group(parent, x, 0, z);
    g.scale.setScalar(s);
    mesh(g, trunkGeo, trunk, 0, 0.2, 0);
    const mat = greens[Math.floor(rand() * greens.length)];
    if (rand() < 0.5) {
      mesh(g, cone, mat, 0, 0.75, 0);
      mesh(g, cone, mat, 0, 1.12, 0).scale.setScalar(0.72);
    } else mesh(g, ball, mat, 0, 0.7, 0);
  };

  for (let placed = 0, tries = 0; placed < 30 && tries < 3000; tries++) {
    const [x, z] = polar(Math.sqrt(rand()) * 6.2, rand() * 360);
    if (blocked(x, z)) continue;
    tree(scene, x, z, 0.8 + rand() * 0.6);
    placed++;
  }
  for (let deg = 100; deg <= 350; deg += 8 + rand() * 9) tree(scene, ...polar(9.55, deg), 0.7 + rand() * 0.5);

  [[-14.5, 1.5, -1, 1.3], [5, 3.5, -15.5, 1]].forEach(([x, y, z, s]) => {
    const g = group(scene, x, y, z);
    g.scale.setScalar(s);
    mesh(g, cyl(1.05, 1, 0.3, 24), std(C.grass), 0, -0.15, 0);
    mesh(g, new THREE.ConeGeometry(0.98, 1.8, 7), std(C.rock, { flatShading: true }), 0, -1.2, 0).rotation.x = Math.PI;
    tree(g, 0.1, 0, 1.1);
  });
}

export function createIsland(scene) {
  land(scene);
  roads(scene);
  trees(scene, rng(11));
}

export function createClouds(scene) {
  const rand = rng(5);
  const mat = std('#ffffff', { roughness: 1 });
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const spots = [[-15, 3, -9, 1.5], [-8, 7, -18, 1.9], [14, 5.5, -15, 1.6], [-20, -2, 5, 1.7], [18, -3.5, 2, 1.4], [3, -6, 16, 1.8], [-7, -6.5, 12, 1.2]];
  const clouds = spots.map(([x, y, z, s], i) => {
    const g = group(scene, x, y, z);
    g.scale.setScalar(s);
    for (let k = 0; k < 5; k++) {
      const puff = mesh(g, geo, mat, (k - 2) * 0.75, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.6);
      puff.scale.set(0.7 + rand() * 0.5, 0.55 + rand() * 0.25, 0.7 + rand() * 0.4);
      puff.raycast = () => {};
    }
    return { g, x, phase: i * 1.3 };
  });
  return (time) => clouds.forEach((c) => (c.g.position.x = c.x + Math.sin(time * 0.05 + c.phase) * 2.5));
}
