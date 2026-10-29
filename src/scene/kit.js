import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const DESK_Y = 0.76;
export const UP = new THREE.Vector3(0, 1, 0);

export const std = (params) => new THREE.MeshStandardMaterial(params);
export const rbox = (w, h, d, r = 0.004, segments = 3) => new RoundedBoxGeometry(w, h, d, segments, r);

export function mesh(parent, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export function group(parent, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}

export function rod(parent, a, b, r, mat) {
  const dir = b.clone().sub(a);
  const m = mesh(parent, new THREE.CylinderGeometry(r, r, dir.length(), 20), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(UP, dir.normalize());
  return m;
}

export function cable(parent, points, mat, r = 0.0035) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return mesh(parent, new THREE.TubeGeometry(curve, 64, r, 8), mat);
}

export function hotspot(object, id, label, view, anchor) {
  object.userData.hotspot = id;
  return {
    id,
    label,
    object,
    anchor: new THREE.Vector3(...anchor),
    view: view && { target: new THREE.Vector3(...view.target), dir: new THREE.Vector3(...view.dir).normalize(), size: view.size },
  };
}
