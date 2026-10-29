import * as THREE from 'three';
import * as T from './textures.js';
import { std, rbox, mesh, group, hotspot } from './kit.js';

const W0 = -1.35;
const W1 = 2.6;
const Z0 = -0.55;
const Z1 = 3.6;
const H = 2.8;
const WIN = { z0: -0.2, z1: 0.9, y0: 0.95, y1: 2.15 };
const HALF = Math.PI / 2;

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.05, 0);
  s.quadraticCurveTo(-0.075, 0.6, 0, 1);
  s.quadraticCurveTo(0.075, 0.6, 0.05, 0);
  s.closePath();
  const geo = new THREE.ShapeGeometry(s, 16);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + 0.075) / 0.15, pos.getY(i));
    pos.setZ(i, Math.pow(pos.getY(i), 2) * 0.08);
  }
  geo.computeVertexNormals();
  return geo;
}

function plant(parent, x, y, z, scale, leafMat) {
  const g = group(parent, x, y, z);
  g.scale.setScalar(scale);
  const profile = [[0, 0], [0.12, 0], [0.125, 0.012], [0.15, 0.34], [0.138, 0.34], [0.114, 0.03], [0, 0.03]];
  mesh(g, new THREE.LatheGeometry(profile.map(([px, py]) => new THREE.Vector2(px, py)), 48), std({ color: '#dcd6ca', roughness: 0.8 }));
  mesh(g, new THREE.CircleGeometry(0.137, 32), std({ color: '#2a2018', roughness: 1 }), 0, 0.315, 0).rotation.x = -HALF;
  const geo = leafGeometry();
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
    const r = Math.random() * 0.05;
    const leaf = mesh(g, geo, leafMat, Math.cos(a) * r, 0.3, Math.sin(a) * r);
    const height = 0.45 + Math.random() * 0.45;
    leaf.scale.set(0.9 + Math.random() * 0.4, height, 1);
    leaf.rotation.set(Math.random() * 0.25 - 0.08, a, 0, 'YXZ');
  }
  return g;
}

function shelf(scene, data) {
  const oak = std({ map: T.oak(), roughness: 0.6 });
  mesh(scene, rbox(1.15, 0.03, 0.22, 0.004), oak, -0.2, 1.52, -0.44);
  const top = 1.535;
  const pages = std({ color: '#ece3cf', roughness: 0.9 });
  const book = (parent, t, h, d, title, bg, fg) => {
    const cover = std({ color: bg, roughness: 0.6 });
    const spineMat = std({ map: T.spine(title, bg, fg, h / t), roughness: 0.55 });
    return mesh(parent, new THREE.BoxGeometry(t, h, d), [cover, cover, pages, pages, spineMat, cover]);
  };

  const skillBooks = group(scene);
  const palette = [['#1f3a5f', '#e8d9b0'], ['#7a2e2e', '#f1e2c0'], ['#2f4f3e', '#e9dcb6'], ['#d9cfbd', '#2a2c33'], ['#33353d', '#d9b26a']];
  const heights = [0.24, 0.22, 0.25, 0.215, 0.235];
  const thick = [0.046, 0.042, 0.05, 0.04, 0.045];
  let x = -0.7;
  data.skills.forEach((s, i) => {
    const k = i % palette.length;
    x += thick[k] / 2;
    book(skillBooks, thick[k], heights[k], 0.17, s.category, ...palette[k]).position.set(x, top + heights[k] / 2, -0.42);
    x += thick[k] / 2 + 0.003;
  });
  const skillsCenter = (-0.7 + x) / 2;

  [[0.03, 0.2, '#8a7d6a'], [0.036, 0.215, '#4b5563']].forEach(([t, h, bg]) => {
    x += t / 2;
    book(scene, t, h, 0.16, '', bg, '#e9e2d0').position.set(x, top + h / 2, -0.425);
    x += t / 2 + 0.003;
  });
  const lean = book(scene, 0.034, 0.21, 0.16, '', '#9a3b2f', '#f0dcc0');
  lean.rotation.z = -0.24;
  lean.position.set(x + 0.017 + Math.sin(0.24) * 0.105, top + Math.cos(0.24) * 0.105 + 0.006, -0.425);

  [[0.2, 0.035, '#2b3a4a'], [0.18, 0.03, '#c8b98f'], [0.17, 0.028, '#5a2f2f']].reduce((y, [w, h, bg], i) => {
    const b = book(scene, w, h, 0.13, '', bg, bg);
    b.position.set(0.12 + i * 0.006, y + h / 2, -0.43);
    b.rotation.y = (i - 1) * 0.06;
    return y + h;
  }, top);

  plant(scene, 0.29, top, -0.44, 0.33, std({ map: T.leaf(), roughness: 0.55, side: THREE.DoubleSide }));

  return hotspot(skillBooks, 'skills', 'Skills', { target: [skillsCenter, 1.66, -0.42], dir: [0.12, -0.04, 1], size: [0.22, 0.17] }, [skillsCenter, 1.82, -0.4]);
}

function corkboard(scene, data) {
  const g = group(scene, 0.98, 1.43, -0.55);
  const frame = std({ map: T.oak(), roughness: 0.55 });
  mesh(g, new THREE.PlaneGeometry(0.72, 0.5), std({ map: T.corkboard(data), roughness: 0.95 }), 0, 0, 0.012);
  mesh(g, new THREE.BoxGeometry(0.72, 0.5, 0.008), std({ color: '#5a4630' }), 0, 0, 0.004);
  [[0, 0.265, 0.78, 0.03], [0, -0.265, 0.78, 0.03], [-0.375, 0, 0.03, 0.5], [0.375, 0, 0.03, 0.5]].forEach(([fx, fy, w, h]) => mesh(g, rbox(w, h, 0.028, 0.004), frame, fx, fy, 0.014));
  return hotspot(g, 'experience', 'Experience', { target: [0.98, 1.43, -0.53], dir: [-0.08, 0, 1], size: [0.4, 0.28] }, [0.8, 1.6, -0.52]);
}

function clock(scene) {
  const g = group(scene, -1.02, 1.95, -0.53);
  g.rotation.x = HALF;
  mesh(g, new THREE.CylinderGeometry(0.15, 0.15, 0.035, 64), std({ color: '#1e1f22', roughness: 0.35, metalness: 0.6 }));
  const face = mesh(g, new THREE.CircleGeometry(0.135, 64), std({ map: T.clockFace(), roughness: 0.7 }), 0, 0.019, 0);
  face.rotation.x = -HALF;
  const handMat = std({ color: '#16171a', roughness: 0.4 });
  const hand = (w, len, mat, y) => {
    const pivot = group(g, 0, y, 0);
    mesh(pivot, new THREE.BoxGeometry(w, 0.002, len), mat, 0, 0, -len / 2 + 0.015);
    return pivot;
  };
  const hours = hand(0.012, 0.085, handMat, 0.021);
  const minutes = hand(0.008, 0.12, handMat, 0.024);
  const seconds = hand(0.003, 0.125, std({ color: '#c8372d', roughness: 0.4 }), 0.027);
  mesh(g, new THREE.CylinderGeometry(0.008, 0.008, 0.012, 16), handMat, 0, 0.026, 0);
  return () => {
    const d = new Date();
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    seconds.rotation.y = -(s / 60) * Math.PI * 2;
    minutes.rotation.y = -(m / 60) * Math.PI * 2;
    hours.rotation.y = -(h / 12) * Math.PI * 2;
  };
}

function windowWall(scene, wallTex, noAO) {
  const s = new THREE.Shape();
  s.moveTo(-Z1, 0);
  s.lineTo(-Z0, 0);
  s.lineTo(-Z0, H);
  s.lineTo(-Z1, H);
  s.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-WIN.z1, WIN.y0);
  hole.lineTo(-WIN.z0, WIN.y0);
  hole.lineTo(-WIN.z0, WIN.y1);
  hole.lineTo(-WIN.z1, WIN.y1);
  hole.closePath();
  s.holes.push(hole);
  const wallMat = std({ map: T.repeated(wallTex, 1, 1), roughness: 0.92 });
  const wall = mesh(scene, new THREE.ShapeGeometry(s), wallMat, W0, 0, 0);
  wall.rotation.y = HALF;

  const zc = (WIN.z0 + WIN.z1) / 2;
  const yc = (WIN.y0 + WIN.y1) / 2;
  const w = WIN.z1 - WIN.z0;
  const h = WIN.y1 - WIN.y0;
  const reveal = std({ map: T.repeated(wallTex, 0.2, 1), roughness: 0.92 });
  const paint = std({ color: '#e7e3da', roughness: 0.45 });
  mesh(scene, new THREE.BoxGeometry(0.2, 0.04, w + 0.08), reveal, W0 - 0.1, WIN.y1 + 0.02, zc);
  mesh(scene, new THREE.BoxGeometry(0.2, h, 0.04), reveal, W0 - 0.1, yc, WIN.z0 - 0.02);
  mesh(scene, new THREE.BoxGeometry(0.2, h, 0.04), reveal, W0 - 0.1, yc, WIN.z1 + 0.02);
  mesh(scene, rbox(0.26, 0.035, w + 0.16, 0.006), paint, W0 - 0.07, WIN.y0 - 0.0175, zc);
  const fx = W0 - 0.14;
  [[0, h / 2 - 0.025, 0.05, w], [0, -h / 2 + 0.025, 0.05, w], [0, 0.18, 0.035, w]].forEach(([, dy, t, len]) => mesh(scene, new THREE.BoxGeometry(0.05, t, len), paint, fx, yc + dy, zc));
  [WIN.z0 + 0.025, WIN.z1 - 0.025, zc].forEach((z, i) => mesh(scene, new THREE.BoxGeometry(0.05, h, i === 2 ? 0.035 : 0.05), paint, fx, yc, z));

  const glass = mesh(scene, new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: '#9fb4d0', roughness: 0.04, transparent: true, opacity: 0.1, depthWrite: false }), fx - 0.01, yc, zc);
  glass.rotation.y = HALF;
  const outside = mesh(scene, new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ map: T.skyline() }), -7, 1.4, 0.4);
  outside.rotation.y = HALF;
  noAO.push(glass, outside);

  const fabric = std({ color: '#b9b1a3', roughness: 1, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(0.42, 1.76, 60, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 46) * 0.022);
  geo.computeVertexNormals();
  [WIN.z0 - 0.06, WIN.z1 + 0.06].forEach((z) => {
    const c = mesh(scene, geo, fabric, W0 + 0.08, 2.27 - 0.88, z);
    c.rotation.y = HALF;
  });
  mesh(scene, new THREE.CylinderGeometry(0.012, 0.012, w + 0.66, 16), std({ color: '#1e1f22', metalness: 0.7, roughness: 0.35 }), W0 + 0.08, 2.29, zc).rotation.x = HALF;

  const moon = new THREE.DirectionalLight('#a9bcff', 1.6);
  moon.position.set(-5, 4.2, -2.2);
  moon.target.position.set(0, 0.2, 0.4);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -2.6, right: 2.6, top: 2.6, bottom: -2.6, near: 1, far: 14 });
  moon.shadow.bias = -0.0004;
  moon.shadow.normalBias = 0.02;
  moon.shadow.radius = 4;
  scene.add(moon, moon.target);
}

export function createRoom(scene, data, noAO) {
  const wallTex = T.plaster('#5d636b');
  const floorTex = T.planks();
  const floor = mesh(scene, new THREE.PlaneGeometry(W1 - W0, Z1 - Z0), std({ map: T.repeated(floorTex, 3.6, 3.5), roughness: 0.5 }), (W0 + W1) / 2, 0, (Z0 + Z1) / 2);
  floor.rotation.x = -HALF;
  const ceiling = mesh(scene, new THREE.PlaneGeometry(W1 - W0, Z1 - Z0), std({ color: '#6f7174', roughness: 1 }), (W0 + W1) / 2, H, (Z0 + Z1) / 2);
  ceiling.rotation.x = HALF;
  mesh(scene, new THREE.PlaneGeometry(W1 - W0, H), std({ map: T.repeated(wallTex, 4, 3), roughness: 0.92 }), (W0 + W1) / 2, H / 2, Z0);
  mesh(scene, new THREE.PlaneGeometry(Z1 - Z0, H), std({ map: T.repeated(wallTex, 4, 3), roughness: 0.92 }), W1, H / 2, (Z0 + Z1) / 2).rotation.y = -HALF;
  windowWall(scene, wallTex, noAO);

  const trim = std({ color: '#d8d4cb', roughness: 0.5 });
  mesh(scene, new THREE.BoxGeometry(W1 - W0, 0.09, 0.016), trim, (W0 + W1) / 2, 0.045, Z0 + 0.008);
  mesh(scene, new THREE.BoxGeometry(0.016, 0.09, Z1 - Z0), trim, W0 + 0.008, 0.045, (Z0 + Z1) / 2);
  mesh(scene, new THREE.BoxGeometry(0.016, 0.09, Z1 - Z0), trim, W1 - 0.008, 0.045, (Z0 + Z1) / 2);

  const rug = mesh(scene, new THREE.PlaneGeometry(2.3, 1.58), std({ map: T.rug(), roughness: 1 }), 0.2, 0.004, 0.72);
  rug.rotation.x = -HALF;

  plant(scene, 1.28, 0, 0.02, 1, std({ map: T.leaf(), roughness: 0.55, side: THREE.DoubleSide }));

  const hotspots = [shelf(scene, data), corkboard(scene, data)];
  const updateClock = clock(scene);
  return { hotspots, update: updateClock };
}
