import * as THREE from 'three';
import * as T from './textures.js';
import { HALF, ROAD, RAIL, PLATFORM, PALETTE as C, std, rbox, cyl, polar, mesh, flat, group, rod, tag } from './kit.js';

const view = (label, target, dir, size, anchor) => ({
  label,
  target: new THREE.Vector3(...target),
  dir: new THREE.Vector3(...dir).normalize(),
  size,
  anchor: new THREE.Vector3(...anchor),
});

function home(scene, data, photoUrl) {
  const g = tag(group(scene, -2.97, 0, 2.97, Math.PI / 4), 'about', null, 'About me');
  const wall = std(C.white);
  const roof = std(C.coral);
  const glass = std(C.glass, { roughness: 0.15, metalness: 0.2 });
  mesh(g, rbox(1.9, 1.1, 1.3), wall, -0.75, 0.55, -0.4);
  mesh(g, rbox(2.1, 0.12, 1.5), roof, -0.75, 1.16, -0.4);
  mesh(g, rbox(1, 0.75, 1), wall, -1.1, 1.59, -0.45);
  mesh(g, rbox(1.2, 0.1, 1.2), roof, -1.1, 2.01, -0.45);
  mesh(g, rbox(0.34, 0.6, 0.06, 0.03), std(C.wood), -0.25, 0.3, 0.26);
  mesh(g, rbox(0.55, 0.4, 0.05, 0.03), glass, -1.15, 0.62, 0.26);
  mesh(g, rbox(0.5, 0.34, 0.05, 0.03), glass, -1.1, 1.62, 0.06);
  mesh(g, rbox(1.3, 0.26, 0.28, 0.1), std('#5fb46a'), -1.1, 0.13, 0.72);

  const steel = std(C.dark);
  [0.55, 1.95].forEach((x) => mesh(g, cyl(0.045, 0.045, 1, 10), steel, x, 0.5, 0.5));
  mesh(g, rbox(1.84, 1.08, 0.08, 0.03), steel, 1.25, 1.45, 0.5);
  mesh(g, new THREE.PlaneGeometry(1.74, 0.98), std('#ffffff', { map: T.billboard(data.profile, photoUrl), roughness: 0.6 }), 1.25, 1.45, 0.545);

  return view('About', [-2.75, 1, 2.85], [1, 0.72, 1], [2.4, 1.6], [-3.2, 2.9, 3.2]);
}

const SLOTS = [[-4.4, -3.2, 1, 5.6], [-4.3, -1.4, 1.2, 3.6], [-1.4, -4.3, 1.2, 4.2], [-2.6, -2.6, 1.5, 2.6], [-3.2, -4.4, 1, 4.8]];
const WALLS = ['#8fbcff', '#ffd08a', '#bba8ff', '#ff9f8c', '#84dccb'];

function roofProp(g, kind, w, h) {
  const dark = std(C.dark);
  if (kind === 0) {
    mesh(g, cyl(0.03, 0.03, 0.9, 8), dark, 0, h + 0.55, 0);
    mesh(g, new THREE.SphereGeometry(0.07, 12, 8), std(C.coral, { emissive: C.coral, emissiveIntensity: 0.8 }), 0, h + 1.02, 0);
  } else if (kind === 1) mesh(g, cyl(0.22, 0.22, 0.32, 16), std(C.wood), w * 0.18, h + 0.26, -w * 0.15);
  else if (kind === 2) mesh(g, new THREE.SphereGeometry(w * 0.36, 24, 10, 0, Math.PI * 2, 0, HALF), std(C.glass, { roughness: 0.2 }), 0, h + 0.1, 0);
  else if (kind === 3) {
    mesh(g, cyl(w * 0.34, w * 0.34, 0.03, 28), dark, 0, h + 0.115, 0);
    flat(g, new THREE.RingGeometry(w * 0.2, w * 0.25, 28), std(C.white), 0, h + 0.135, 0);
  } else [-0.2, 0.2].forEach((x) => mesh(g, rbox(0.25, 0.18, 0.25, 0.03), std('#d9dde6'), x, h + 0.19, 0.1));
}

function downtown(scene, data) {
  data.projects.forEach((p, i) => {
    const [x, z, w, h] = SLOTS[i % SLOTS.length];
    const g = tag(group(scene, x, 0, z), 'projects', i, p.name);
    const side = std('#ffffff', { map: T.facade(w, h, WALLS[i % WALLS.length], p.name.split(/ \(|:/)[0]) });
    const top = std(C.white);
    mesh(g, new THREE.BoxGeometry(w, h, w), [side, side, top, top, side, side], 0, h / 2, 0);
    mesh(g, rbox(w + 0.16, 0.1, w + 0.16, 0.03), std(C.paving), 0, 0.05, 0);
    mesh(g, rbox(w + 0.1, 0.1, w + 0.1, 0.03), top, 0, h + 0.05, 0);
    roofProp(g, i % 5, w, h);
  });
  return view('Projects', [-3, 2.3, -3], [1, 0.62, 1], [3.4, 3.5], [-3.3, 6.2, -3.3]);
}

function datacenter(scene, data) {
  const g = group(scene, 2.97, 0, -2.97, Math.PI / 4);
  mesh(g, rbox(3.3, 1, 1.2), std('#eef1f7'), 0, 0.5, -0.75);
  mesh(g, rbox(3.4, 0.1, 1.3, 0.04), std(C.accent), 0, 1.05, -0.75);
  const fans = [-0.8, 0.8].map((x) => {
    mesh(g, cyl(0.27, 0.27, 0.12, 24), std(C.dark), x, 1.16, -0.75);
    const blades = group(g, x, 1.235, -0.75);
    [0, HALF].forEach((ry) => (mesh(blades, new THREE.BoxGeometry(0.46, 0.02, 0.08), std('#d9dde6')).rotation.y = ry));
    return blades;
  });

  const lights = ['#5eead4', '#fbbf24', '#f472b6', '#60a5fa', '#a3e635'];
  const leds = data.skills.map((s, i) => {
    const r = tag(group(g, (i - (data.skills.length - 1) / 2) * 0.64, 0, 0.35), 'skills', i, s.category);
    mesh(r, rbox(0.52, 1.4, 0.52, 0.04), std(C.dark), 0, 0.7, 0);
    mesh(r, new THREE.PlaneGeometry(0.44, 1.26), std('#ffffff', { map: T.rack(s.category) }), 0, 0.72, 0.262);
    const color = lights[i % lights.length];
    const led = std(color, { emissive: color, emissiveIntensity: 1.5 });
    for (let k = 0; k < 4; k++) mesh(r, new THREE.BoxGeometry(0.07, 0.035, 0.02), led, 0.13, 1.26 - k * 0.08, 0.268);
    return led;
  });

  return {
    view: view('Skills', [3.1, 0.8, -2.85], [1, 0.7, 1], [2.5, 1.6], [3.3, 2.2, -2.7]),
    update(dt, time) {
      fans.forEach((f) => (f.rotation.y += dt * 6));
      leds.forEach((led, i) => (led.emissiveIntensity = Math.sin(time * 4 + i * 1.7) > 0 ? 2.2 : 0.4));
    },
  };
}

function tower(scene, noAO) {
  const g = tag(group(scene, 1.3, 0, -5), 'contact', null, 'Contact');
  const paint = std(C.coral);
  const white = std(C.white);
  const H = 4.2;
  [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([sx, sz]) => rod(g, new THREE.Vector3(sx * 0.55, 0, sz * 0.55), new THREE.Vector3(sx * 0.09, H, sz * 0.09), 0.04, paint));
  [1, 2, 3, 4.1].forEach((y, i) => {
    const half = 0.55 - (0.46 * y) / H;
    mesh(g, new THREE.TorusGeometry(half * Math.SQRT2, 0.03, 6, 4), i % 2 ? white : paint, 0, y, 0).rotation.set(HALF, 0, Math.PI / 4);
  });
  mesh(g, cyl(0.03, 0.03, 1, 8), white, 0, H + 0.5, 0);
  const beacon = std('#ff4d4d', { emissive: '#ff2a2a', emissiveIntensity: 2 });
  mesh(g, new THREE.SphereGeometry(0.09, 16, 10), beacon, 0, H + 1.05, 0);
  mesh(g, rbox(0.62, 0.5, 0.62), white, 0, 0.25, 0);
  mesh(g, rbox(0.72, 0.08, 0.72, 0.03), std(C.accent), 0, 0.54, 0);

  const rings = [0, 1, 2].map(() => {
    const ring = mesh(g, new THREE.TorusGeometry(1, 0.03, 8, 64), new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, depthWrite: false }), 0, H + 1.05, 0);
    ring.rotation.x = HALF;
    ring.raycast = () => {};
    noAO.push(ring);
    return ring;
  });

  return {
    view: view('Contact', [1.3, 2.8, -5], [0.25, 0.5, -1], [2.1, 3.2], [1.3, 6, -5]),
    update(dt, time) {
      beacon.emissiveIntensity = Math.sin(time * 3) > 0.3 ? 3 : 0.3;
      rings.forEach((ring, k) => {
        const t = (time * 0.4 + k / 3) % 1;
        ring.scale.setScalar(0.2 + t * 1.8);
        ring.material.opacity = (1 - t) * 0.6;
      });
    },
  };
}

function stations(scene, data) {
  const roles = [...data.experience].reverse();
  const colors = ['#60a5fa', '#a78bfa', C.coral, '#34d399'];
  roles.forEach((e, k) => {
    const deg = roles.length > 1 ? 66 - (k * 42) / (roles.length - 1) : 45;
    const [x, z] = polar(PLATFORM, deg);
    const g = tag(group(scene, x, 0, z, HALF - (deg * Math.PI) / 180), 'experience', data.experience.indexOf(e), `${e.role} · ${e.company}`);
    const color = colors[k % colors.length];
    mesh(g, rbox(2, 0.14, 0.72, 0.05), std(C.paving), 0, 0.07, 0);
    [-0.8, 0.8].forEach((px) => mesh(g, cyl(0.04, 0.04, 0.95, 8), std(C.dark), px, 0.6, -0.18));
    mesh(g, rbox(2.1, 0.08, 0.78, 0.03), std(color), 0, 1.1, -0.1);
    mesh(g, rbox(1.5, 0.52, 0.06, 0.02), std(C.dark), 0, 1.42, -0.2);
    mesh(g, new THREE.PlaneGeometry(1.44, 0.46), std('#ffffff', { map: T.sign(e.company, e.period, color) }), 0, 1.42, -0.165);
    mesh(g, rbox(0.6, 0.07, 0.18, 0.02), std(C.wood), 0, 0.36, -0.12);
    [-0.24, 0.24].forEach((px) => mesh(g, new THREE.BoxGeometry(0.05, 0.2, 0.16), std(C.dark), px, 0.24, -0.12));
  });
  const [x, z] = polar(PLATFORM, 45);
  return view('Experience', [x - 0.3, 0.8, z - 0.3], [1, 0.75, 1], [4.1, 1.9], [x, 2.5, z]);
}

function place(obj, r, a, reverse) {
  obj.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
  obj.rotation.y = -a + (reverse ? Math.PI : 0);
}

function traffic(scene) {
  const glass = std(C.glass, { roughness: 0.2 });
  const dark = std(C.dark);
  const train = [C.coral, '#ffd166', '#8fbcff'].map((color, k) => {
    const car = tag(group(scene), 'experience', null, 'Career line');
    mesh(car, new THREE.BoxGeometry(0.34, 0.1, 0.78), dark, 0, 0.14, 0);
    mesh(car, rbox(0.42, 0.4, 0.9, 0.08), std(color), 0, 0.38, 0);
    if (k === 0) {
      mesh(car, rbox(0.42, 0.26, 0.34, 0.06), dark, 0, 0.68, -0.26);
      mesh(car, cyl(0.07, 0.09, 0.24, 12), dark, 0, 0.68, 0.24);
    } else mesh(car, rbox(0.44, 0.14, 0.62, 0.03), glass, 0, 0.44, 0);
    return car;
  });

  const cars = [[ROAD - 0.17, 0.2, 0, C.coral], [ROAD + 0.17, -0.16, 2, C.accent], [ROAD - 0.17, 0.14, 4, '#ffd166']].map(([r, speed, offset, color]) => {
    const g = group(scene);
    mesh(g, rbox(0.3, 0.14, 0.56, 0.06), std(color), 0, 0.13, 0);
    mesh(g, rbox(0.26, 0.12, 0.28, 0.05), glass, 0, 0.26, -0.03);
    return { g, r, speed, offset };
  });

  return (time) => {
    train.forEach((car, k) => place(car, RAIL, time * 0.1 - k * 0.118));
    cars.forEach((c) => place(c.g, c.r, c.offset + time * c.speed, c.speed < 0));
  };
}

function plaza(scene) {
  mesh(scene, cyl(0.5, 0.62, 0.3, 32), std('#d9d2c3'), 0, 0.17, 0);
  const gem = mesh(scene, new THREE.OctahedronGeometry(0.46), std(C.accent, { roughness: 0.25, metalness: 0.3, emissive: C.accent, emissiveIntensity: 0.25, flatShading: true }), 0, 1.2, 0);
  return (time) => {
    gem.rotation.y = time * 0.8;
    gem.position.y = 1.2 + Math.sin(time * 1.6) * 0.08;
  };
}

export function createCity(scene, data, noAO, photoUrl) {
  const racks = datacenter(scene, data);
  const radio = tower(scene, noAO);
  const moveTraffic = traffic(scene);
  const spinGem = plaza(scene);
  return {
    views: {
      about: home(scene, data, photoUrl),
      experience: stations(scene, data),
      projects: downtown(scene, data),
      skills: racks.view,
      contact: radio.view,
    },
    update(dt, time) {
      racks.update(dt, time);
      radio.update(dt, time);
      moveTraffic(time);
      spinGem(time);
    },
  };
}
