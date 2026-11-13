import * as THREE from 'three';
import * as T from './textures.js';
import { DESK_Y as D, UP, std, rbox, mesh, group, rod, cable, hotspot } from './kit.js';
import { createScreen, createPhoneScreen } from './screen.js';

const HALF = Math.PI / 2;
const black = () => std({ color: '#1b1c1f', metalness: 0.55, roughness: 0.42 });

function desk(scene) {
  mesh(scene, rbox(1.7, 0.035, 0.78, 0.006), std({ map: T.walnut(), roughness: 0.42 }), 0, D - 0.0175, -0.01);
  const metal = black();
  [-0.79, 0.79].forEach((x) => {
    [-0.33, 0.33].forEach((z) => mesh(scene, rbox(0.045, D - 0.035, 0.045, 0.006), metal, x, (D - 0.035) / 2, z));
    mesh(scene, rbox(0.05, 0.03, 0.74, 0.008), metal, x, 0.015, 0);
    mesh(scene, rbox(0.04, 0.04, 0.7, 0.006), metal, x, D - 0.055, 0);
  });
  mesh(scene, rbox(1.54, 0.05, 0.025, 0.006), metal, 0, D - 0.06, -0.33);
  mesh(scene, rbox(0.95, 0.003, 0.4, 0.0014, 2), std({ map: T.felt(), roughness: 1 }), 0.05, D + 0.0015, 0.14);
  const wire = std({ color: '#141416', roughness: 0.6 });
  cable(scene, [[0, D + 0.12, -0.285], [0.02, D + 0.03, -0.33], [0.06, D + 0.0035, -0.37], [0.1, D - 0.012, -0.413], [0.12, 0.4, -0.45], [0.16, 0.02, -0.5], [0.4, 0.0035, -0.53]], wire);
  cable(scene, [[0.7, D + 0.006, -0.27], [0.71, D + 0.0035, -0.34], [0.72, D - 0.012, -0.413], [0.74, 0.3, -0.45], [0.8, 0.0035, -0.52], [1, 0.0035, -0.535]], wire);
}

function monitor(scene, data, keyboard, noAO) {
  const g = group(scene, 0, D, -0.2);
  const alu = std({ color: '#a9adb4', metalness: 0.9, roughness: 0.32 });
  const shell = std({ color: '#17181b', metalness: 0.35, roughness: 0.38 });
  mesh(g, rbox(0.26, 0.012, 0.19, 0.005), alu, 0, 0.006, -0.03);
  mesh(g, rbox(0.06, 0.32, 0.022, 0.008), alu, 0, 0.17, -0.085).rotation.x = 0.1;
  const head = group(g, 0, 0.3, 0);
  head.rotation.x = -0.06;
  mesh(head, rbox(0.64, 0.375, 0.022, 0.008), shell);
  mesh(head, rbox(0.42, 0.26, 0.03, 0.012), shell, 0, -0.01, -0.02);
  const screen = createScreen(data, keyboard.press);
  const display = mesh(head, new THREE.PlaneGeometry(0.618, 0.348), new THREE.MeshBasicMaterial({ map: screen.texture, color: '#e4e4e4', toneMapped: false }), 0, 0.006, 0.0115);
  noAO.push(display);

  const glow = new THREE.RectAreaLight('#c9d6ff', 2.4, 0.6, 0.34);
  glow.position.set(0, D + 0.3, -0.17);
  scene.add(glow);
  glow.lookAt(0, D + 0.1, 1);

  return {
    update: screen.update,
    spot: hotspot(g, 'projects', 'Projects', { target: [0, D + 0.305, -0.19], dir: [0, 0.04, 1], size: [0.33, 0.19] }, [0, D + 0.53, -0.18]),
  };
}

function keyboard(scene) {
  const g = group(scene, -0.06, D + 0.003, 0.13);
  g.rotation.x = 0.04;
  mesh(g, rbox(0.305, 0.014, 0.108, 0.005), std({ color: '#2a2d32', metalness: 0.6, roughness: 0.4 }), 0, 0.007, 0);
  const u = 0.019;
  const mats = { a: std({ color: '#dedbd3', roughness: 0.55 }), m: std({ color: '#5a5f68', roughness: 0.55 }), x: std({ color: '#e0703a', roughness: 0.5 }) };
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
    [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
    [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
  ];
  const geos = {};
  const keys = [];
  rows.forEach((row, r) => {
    let x = (-15 * u) / 2;
    row.forEach((w, i) => {
      const alpha = w === 1 && r < 4;
      const mat = r === 0 && i === 0 ? mats.x : alpha ? mats.a : mats.m;
      geos[w] = geos[w] || rbox(w * u - 0.0028, 0.009, u - 0.0028, 0.0016, 2);
      const key = mesh(g, geos[w], mat, x + (w * u) / 2, 0.0185, (r - 2) * u);
      if (alpha) keys.push({ mesh: key, t: 0 });
      x += w * u;
    });
  });
  return {
    press() {
      keys[Math.floor(Math.random() * keys.length)].t = 0.09;
    },
    update(dt) {
      keys.forEach((k) => {
        if (k.t <= 0 && k.mesh.position.y === 0.0185) return;
        k.t -= dt;
        k.mesh.position.y = k.t > 0 ? 0.0158 : 0.0185;
      });
    },
  };
}

function mouse(scene) {
  const g = group(scene, 0.32, D + 0.003, 0.16);
  g.rotation.y = -0.08;
  mesh(g, new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, HALF), std({ color: '#1e2024', roughness: 0.35, metalness: 0.2 })).scale.set(0.031, 0.019, 0.056);
  mesh(g, new THREE.CylinderGeometry(0.006, 0.006, 0.004, 24), std({ color: '#55595f', roughness: 0.5 }), 0, 0.0145, -0.026).rotation.z = HALF;
}

function mug(scene, noAO) {
  const g = group(scene, -0.66, D, 0.02);
  const profile = [[0, 0.002], [0.035, 0], [0.038, 0.004], [0.04, 0.09], [0.0402, 0.095], [0.0365, 0.095], [0.035, 0.09], [0.034, 0.01], [0, 0.01]];
  const ceramic = std({ color: '#ebe6dc', roughness: 0.28 });
  mesh(g, new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 48), ceramic);
  mesh(g, new THREE.TorusGeometry(0.026, 0.0065, 12, 32, Math.PI), ceramic, 0.04, 0.05, 0).rotation.z = -HALF;
  mesh(g, new THREE.CircleGeometry(0.0345, 32), std({ color: '#2b170c', roughness: 0.12 }), 0, 0.08, 0).rotation.x = -HALF;

  const tex = T.blob();
  const puffs = Array.from({ length: 7 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
    s.raycast = () => {};
    g.add(s);
    noAO.push(s);
    return { s, offset: i / 7 };
  });
  return (time) => {
    puffs.forEach(({ s, offset }, i) => {
      const t = (time * 0.22 + offset) % 1;
      s.position.set(Math.sin(time * 0.9 + i * 1.7) * 0.014 * t * 2, 0.09 + t * 0.2, Math.cos(time * 0.7 + i) * 0.01 * t * 2);
      s.scale.setScalar(0.03 + t * 0.08);
      s.material.opacity = Math.sin(Math.PI * t) * 0.11;
    });
  };
}

function notebook(scene) {
  const g = group(scene, -0.44, D, 0.2);
  g.rotation.y = 0.18;
  mesh(g, rbox(0.15, 0.014, 0.21, 0.004), std({ color: '#1f2a3d', roughness: 0.75 }), 0, 0.007, 0);
  mesh(g, new THREE.BoxGeometry(0.006, 0.0152, 0.2112), std({ color: '#0f1012', roughness: 0.6 }), 0.055, 0.007, 0);
  const pen = group(g, -0.01, 0.019, 0.01);
  pen.rotation.y = 0.65;
  mesh(pen, new THREE.CylinderGeometry(0.0045, 0.0045, 0.13, 24), std({ color: '#111214', metalness: 0.5, roughness: 0.25 })).rotation.z = HALF;
  mesh(pen, new THREE.ConeGeometry(0.0045, 0.014, 24), std({ color: '#c9a35b', metalness: 1, roughness: 0.25 }), -0.072, 0, 0).rotation.z = HALF;
}

function phone(scene, profile, noAO) {
  const g = group(scene, 0.52, D, 0.12);
  g.rotation.y = -0.3;
  mesh(g, rbox(0.074, 0.008, 0.155, 0.0035), std({ color: '#2a2b30', metalness: 0.7, roughness: 0.3 }), 0, 0.004, 0);
  const screen = mesh(g, new THREE.PlaneGeometry(0.068, 0.148), new THREE.MeshBasicMaterial({ map: createPhoneScreen(profile), color: '#d6d6d6', toneMapped: false }), 0, 0.0082, 0);
  screen.rotation.x = -HALF;
  noAO.push(screen);
  return hotspot(g, 'contact', 'Contact', { target: [0.52, D + 0.008, 0.12], dir: [-0.09, 1, 0.29], size: [0.07, 0.1] }, [0.52, D + 0.05, 0.12]);
}

function frame(scene, profile) {
  const g = group(scene, -0.58, D, -0.25);
  g.rotation.y = 0.45;
  const tilt = group(g, 0, 0, 0);
  tilt.rotation.x = -0.12;
  mesh(tilt, rbox(0.15, 0.19, 0.014, 0.003), std({ color: '#1d1d1f', roughness: 0.45, metalness: 0.3 }), 0, 0.095, 0);
  mesh(tilt, new THREE.PlaneGeometry(0.128, 0.168), std({ color: '#f1eee8', roughness: 0.9 }), 0, 0.095, 0.0078);
  const photoMat = std({ color: '#ffffff', roughness: 0.6 });
  mesh(tilt, new THREE.PlaneGeometry(0.096, 0.128), photoMat, 0, 0.097, 0.0085);
  new THREE.TextureLoader().load(import.meta.env.BASE_URL + profile.profile_image.replace(/^\//, ''), (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.repeat.set(0.75, 1);
    tex.offset.set(0.125, 0);
    photoMat.map = tex;
    photoMat.needsUpdate = true;
  });
  mesh(g, new THREE.BoxGeometry(0.03, 0.15, 0.004), std({ color: '#1d1d1f' }), 0, 0.07, -0.035).rotation.x = 0.4;
  return hotspot(g, 'about', 'About me', { target: [-0.578, D + 0.094, -0.243], dir: [0.43, 0.3, 0.9], size: [0.1, 0.11] }, [-0.58, D + 0.23, -0.24]);
}

function lamp(scene) {
  const g = group(scene, 0.68, D, -0.2);
  g.rotation.y = Math.PI + 0.5;
  const paint = black();
  const brass = std({ color: '#c9a35b', metalness: 1, roughness: 0.3 });
  mesh(g, new THREE.CylinderGeometry(0.072, 0.08, 0.018, 48), paint, 0, 0.009, 0);
  const A = new THREE.Vector3(0, 0.03, 0);
  const B = new THREE.Vector3(-0.098, 0.397, 0);
  const C = new THREE.Vector3(0.256, 0.46, 0);
  [-0.008, 0.008].forEach((z) => {
    const off = new THREE.Vector3(0, 0, z);
    rod(g, A.clone().add(off), B.clone().add(off), 0.005, paint);
    rod(g, B.clone().add(off), C.clone().add(off), 0.005, paint);
  });
  [A, B, C].forEach((p) => (mesh(g, new THREE.CylinderGeometry(0.011, 0.011, 0.03, 24), brass, p.x, p.y, p.z).rotation.x = HALF));

  const dir = new THREE.Vector3(Math.sin(0.35), -Math.cos(0.35), 0);
  const head = group(g, C.x, C.y, C.z);
  head.quaternion.setFromUnitVectors(UP, dir.clone().negate());
  mesh(head, new THREE.CylinderGeometry(0.026, 0.07, 0.12, 48, 1, true), paint, 0, -0.07, 0);
  const inner = std({ color: '#f4efe6', roughness: 0.6, emissive: '#ffcf96', emissiveIntensity: 0.6, side: THREE.BackSide });
  mesh(head, new THREE.CylinderGeometry(0.025, 0.068, 0.118, 48, 1, true), inner, 0, -0.07, 0);
  mesh(head, new THREE.CylinderGeometry(0.026, 0.026, 0.02, 32), paint, 0, -0.005, 0);
  const bulbMat = std({ color: '#fff4e0', emissive: '#ffd9a8', emissiveIntensity: 9 });
  mesh(head, new THREE.SphereGeometry(0.022, 24, 16), bulbMat, 0, -0.05, 0);

  const spot = new THREE.SpotLight('#ffd3a3', 5, 0, 0.82, 0.75, 2);
  spot.position.copy(C).addScaledVector(dir, 0.05);
  spot.target.position.copy(C).addScaledVector(dir, 1);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.camera.near = 0.03;
  spot.shadow.camera.far = 3;
  spot.shadow.bias = -0.0004;
  spot.shadow.normalBias = 0.004;
  spot.shadow.radius = 5;
  g.add(spot, spot.target);

  const fill = new THREE.PointLight('#ffb978', 0.35, 0, 2);
  fill.position.set(0.1, 0.8, 0.25);
  g.add(fill);

  let on = 1;
  let level = 1;
  return {
    spot: hotspot(g, 'lamp', 'Desk lamp', null, [0.4, D + 0.55, -0.1]),
    toggle: () => (on = 1 - on),
    update(dt) {
      level += (on - level) * Math.min(1, dt * 10);
      spot.intensity = 5 * level;
      fill.intensity = 0.35 * level;
      bulbMat.emissiveIntensity = 9 * level;
      inner.emissiveIntensity = 0.6 * level;
    },
  };
}

export function createDesk(scene, data, noAO) {
  desk(scene);
  const keys = keyboard(scene);
  const screen = monitor(scene, data, keys, noAO);
  mouse(scene);
  const steam = mug(scene, noAO);
  notebook(scene);
  const lights = lamp(scene);
  const hotspots = [screen.spot, frame(scene, data.profile), phone(scene, data.profile, noAO), lights.spot];
  return {
    hotspots,
    toggleLamp: lights.toggle,
    update(dt, time) {
      screen.update(dt);
      keys.update(dt);
      steam(time);
      lights.update(dt);
    },
  };
}
