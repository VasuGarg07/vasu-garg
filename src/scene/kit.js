import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const HALF = Math.PI / 2;
export const UP = new THREE.Vector3(0, 1, 0);
export const ISLAND = 10;
export const ROAD = 7;
export const RAIL = 8.8;
export const PLATFORM = 8.05;

export const PALETTE = {
  grass: '#9fd67f',
  soil: '#b98b62',
  rock: '#8d93a3',
  road: '#5f6673',
  paving: '#ece6da',
  white: '#fbf7f0',
  glass: '#9bd8ff',
  wood: '#b8845a',
  dark: '#2d3342',
  accent: '#5b5bf0',
  coral: '#ff7a59',
};

export const std = (color, extra) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });
export const rbox = (w, h, d, r = 0.06) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, Math.min(w, h, d) * 0.49));
export const cyl = (rt, rb, h, s = 24) => new THREE.CylinderGeometry(rt, rb, h, s);
export const v2 = ([x, y]) => new THREE.Vector2(x, y);
export const polar = (r, deg) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];

export function mesh(parent, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export function flat(parent, geo, mat, x, y, z) {
  const m = mesh(parent, geo, mat, x, y, z);
  m.rotation.x = -HALF;
  return m;
}

export function group(parent, x = 0, y = 0, z = 0, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  return g;
}

export function rod(parent, a, b, r, mat) {
  const dir = b.clone().sub(a);
  const m = mesh(parent, cyl(r, r, dir.length(), 10), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(UP, dir.normalize());
  return m;
}

export function tag(object, id, item, label) {
  object.userData.hotspot = { id, item, label, object };
  return object;
}

export function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
