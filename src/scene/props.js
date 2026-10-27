import * as THREE from 'three';
import { GAP } from '../config.js';
import { add, cyl, box, canvasTex, wrap, HALF, FONTS } from './util.js';
import { red, ink, stone, wood, glow } from './materials.js';
import { toro } from './world.js';

const SKILL_Z = -GAP * 2 - 7;
const STELE_Z = -GAP * 3 - 4.5;
const EMA_Z = -GAP * 4 - 7.5;

const LAYOUT = {
  skill: {
    z: SKILL_Z, baseDrop: 2.16, topOff: 0.76, rowGap: 1.6,
    wide: { cols: 99, gap: 1.9, scale: 1, y: 4.8 },
    narrow: { cols: 3, gap: 1.55, scale: 0.8, y: 5.9 },
  },
  ema: {
    z: EMA_Z, baseDrop: 1.55, topOff: 0.45, rowGap: 1.4,
    wide: { cols: 99, gap: 2.0, scale: 1, y: 4.55 },
    narrow: { cols: 3, gap: 1.7, scale: 0.78, y: 5.1 },
  },
};

function rack(scene, z, halfWidth, y) {
  const g = new THREE.Group();
  [-halfWidth, halfWidth].forEach((x) => add(g, cyl(0.2, 0.26, y + 0.4), red, x, (y + 0.4) / 2, 0));
  add(g, box(halfWidth * 2 + 1.4, 0.3, 0.4), red, 0, y, 0);
  add(g, box(halfWidth * 2 + 2.2, 0.16, 0.6), ink, 0, y + 0.25, 0);
  g.position.z = z;
  scene.add(g);
  return g;
}

function steleTexture(e) {
  return canvasTex(512, 640, (x, w, h) => {
    x.textAlign = 'left';
    x.fillStyle = '#efe3c8';
    x.font = `700 46px ${FONTS.serif}`;
    let y = 90;
    wrap(x, e.role, w - 80).forEach((l) => { x.fillText(l, 40, y); y += 54; });
    x.fillStyle = '#f1c97a';
    x.font = `500 32px ${FONTS.sans}`;
    wrap(x, e.company, w - 80).forEach((l) => { x.fillText(l, 40, y + 10); y += 40; });
    x.fillStyle = '#c9bba0';
    x.font = `500 26px ${FONTS.sans}`;
    x.fillText(e.period, 40, y + 30);
    x.fillStyle = '#c42a17';
    x.fillRect(40, y + 60, 120, 5);
    x.font = `700 130px ${FONTS.serif}`;
    x.fillStyle = 'rgba(239, 227, 200, 0.12)';
    x.fillText(e.current ? '今' : '昔', w - 190, h - 50);
  });
}

function plaqueTexture(p) {
  return canvasTex(400, 310, (x, w, h) => {
    x.textAlign = 'center';
    x.fillStyle = '#2b1709';
    x.font = `700 40px ${FONTS.serif}`;
    wrap(x, p.name.replace(/\s*\(.*\)/, ''), w - 70).slice(0, 3).forEach((l, k) => x.fillText(l, w / 2, 100 + k * 46));
    x.font = `500 22px ${FONTS.sans}`;
    x.fillStyle = '#6b3b17';
    x.fillText(p.stack.slice(0, 2).join(' · '), w / 2, h - 40);
    x.fillStyle = '#b3261a';
    x.beginPath();
    x.arc(w - 52, 82, 24, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#fff';
    x.font = `700 26px ${FONTS.serif}`;
    x.fillText('祈', w - 52, 92);
  });
}

function lanternLabel(category) {
  return canvasTex(256, 368, (x, w, h) => {
    x.textAlign = 'center';
    x.fillStyle = '#ffe3a0';
    x.font = `700 44px ${FONTS.serif}`;
    wrap(x, category.replace('&', '+'), w - 30).forEach((l, k, a) => x.fillText(l, w / 2, h / 2 + (k - (a.length - 1) / 2) * 54 + 14));
  });
}

export function createProps(scene, data) {
  const { skills, experience, projects } = data;
  const interactives = [];
  const items = [];
  const hangers = { skill: [], ema: [] };
  const steles = [];

  function register(group, item) {
    item.group = group;
    items.push(item);
    group.traverse((o) => {
      if (!o.isMesh) return;
      o.userData.item = item;
      interactives.push(o);
    });
  }

  function hang(kind, pivot, g, stringXs) {
    const strings = stringXs.map((x) => add(pivot, cyl(0.012, 0.012, 1, 6), ink, x, 0, 0));
    hangers[kind].push({ pivot, g, strings });
    scene.add(pivot);
  }

  const racks = {
    skill: { wide: rack(scene, SKILL_Z, 5.4, 4.8), narrow: rack(scene, SKILL_Z, 2.6, 5.9) },
    ema: { wide: rack(scene, EMA_Z, 5.8, 4.7), narrow: rack(scene, EMA_Z, 2.8, 5.2) },
  };

  skills.forEach((s, i) => {
    const pivot = new THREE.Group();
    const g = new THREE.Group();
    const paper = new THREE.MeshStandardMaterial({ color: 0xd8341c, emissive: 0xff4a1a, emissiveIntensity: 1.1, roughness: 0.9 });
    add(g, new THREE.SphereGeometry(0.55, 24, 16).scale(1, 1.3, 1), paper);
    add(g, cyl(0.3, 0.3, 0.12), ink, 0, 0.7, 0);
    add(g, cyl(0.3, 0.3, 0.12), ink, 0, -0.7, 0);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.95),
      new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, map: lanternLabel(s.category) })
    );
    label.position.z = 0.56;
    g.add(label);
    pivot.add(g);
    hang('skill', pivot, g, [0]);
    register(g, { type: 'skill', skill: s, pivot, phase: i * 1.3 });
  });

  experience.forEach((e, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const g = new THREE.Group();
    g.rotation.y = -side * 0.5;
    add(g, box(1.9, 2.6, 0.4), stone, 0, 1.3, 0);
    add(g, box(2.1, 0.2, 0.55), ink, 0, 2.7, 0);
    add(g, box(2.2, 0.25, 0.7), ink, 0, 0.12, 0);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.1), new THREE.MeshBasicMaterial({ map: steleTexture(e), transparent: true, toneMapped: false }));
    face.position.set(0, 1.35, 0.205);
    g.add(face);
    g.position.z = STELE_Z - Math.floor(i / 2) * 5;
    scene.add(g);
    steles.push({ g, side });
  });

  const woodLight = 0xc79a62;
  projects.forEach((p, i) => {
    const pivot = new THREE.Group();
    const g = new THREE.Group();
    const w = 1.55;
    const h = 1.2;
    const shape = new THREE.Shape([
      new THREE.Vector2(-w / 2, -h / 2), new THREE.Vector2(w / 2, -h / 2), new THREE.Vector2(w / 2, h / 2 - 0.3),
      new THREE.Vector2(0, h / 2), new THREE.Vector2(-w / 2, h / 2 - 0.3),
    ]);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
    geo.translate(0, 0, -0.04);
    const mat = new THREE.MeshStandardMaterial({ color: woodLight, roughness: 0.8, emissive: 0xffa24a, emissiveIntensity: 0.15 });
    add(g, geo, mat);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 0.92, h * 0.86),
      new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, map: plaqueTexture(p) })
    );
    face.position.set(0, -0.04, 0.05);
    g.add(face);
    pivot.add(g);
    hang('ema', pivot, g, [-0.4, 0.4]);
    register(g, { type: 'ema', project: p, mat, pivot, phase: i * 0.9 });
  });

  const shrine = new THREE.Group();
  shrine.position.z = -131;
  scene.add(shrine);
  add(shrine, box(12, 1, 10), stone, 0, 0.5, 0);
  [[6.5, 0.33, 5.7], [5.8, 0.66, 5.2], [5.1, 0.99, 5.0]].forEach(([w, h, z]) => add(shrine, box(w, h, 0.7), stone, 0, h / 2, z));
  add(shrine, box(8, 3.4, 5.5), wood, 0, 2.7, -1);
  [-3.6, -1.2, 1.2, 3.6].forEach((x) => add(shrine, cyl(0.24, 0.28, 3.4), red, x, 2.7, 3.2));
  add(shrine, box(9, 0.35, 0.5), red, 0, 4.55, 3.2);
  const roof = add(shrine, new THREE.ConeGeometry(7, 2.8, 4), new THREE.MeshStandardMaterial({ color: 0x1a1922, roughness: 0.8 }), 0, 5.95, 0.5);
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = 0.8;
  [-1, 1].forEach((s) => add(shrine, box(1.7, 2.4, 0.1), glow, s * 0.95, 2.3, 1.78));
  add(shrine, box(2.6, 0.8, 1.0), wood, 0, 1.4, 4.2);
  for (let i = -3; i <= 3; i++) add(shrine, box(0.06, 0.04, 1.02), ink, i * 0.34, 1.82, 4.2);

  shrine.add(new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-4, 4.2, 3.6), new THREE.Vector3(0, 3.95, 3.6), new THREE.Vector3(4, 4.2, 3.6)]), 24, 0.1, 8),
    new THREE.MeshStandardMaterial({ color: 0xe8dcc0, emissive: 0x4a4030 })
  ));
  const paperWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x777777 });
  for (let i = -3; i <= 3; i++) {
    add(shrine, box(0.26, 0.5, 0.02), paperWhite, i * 1.05, 3.65, 3.62).rotation.z = (i % 2 ? 1 : -1) * 0.08;
  }

  const bell = new THREE.Group();
  bell.position.set(0, 0, 3.5);
  const gold = new THREE.MeshStandardMaterial({ color: 0xe0b040, metalness: 0.7, roughness: 0.3, emissive: 0x6a4a10, emissiveIntensity: 0.6 });
  const ropeWhite = new THREE.MeshStandardMaterial({ color: 0xf4efe4, emissive: 0x555555 });
  add(bell, new THREE.SphereGeometry(0.5, 20, 14), gold, 0, 3.55, 0);
  add(bell, cyl(0.3, 0.3, 0.1), ink, 0, 3.55, 0.42).rotation.x = HALF;
  [0, 1, 2].forEach((i) => add(bell, cyl(0.07, 0.07, 0.42, 8), i % 2 ? ropeWhite : red, 0, 3.0 - i * 0.42, 0));
  shrine.add(bell);
  register(bell, { type: 'bell' });

  [-5.3, 5.3].forEach((x) => {
    const lantern = toro();
    lantern.position.set(x, 1, 5.5);
    lantern.scale.setScalar(1.3);
    shrine.add(lantern);
  });
  const shrineLight = new THREE.PointLight(0xffa860, 70, 24, 2);
  shrineLight.position.set(0, 3, -124);
  scene.add(shrineLight);

  function setLayout(narrow) {
    Object.keys(hangers).forEach((kind) => {
      const L = LAYOUT[kind];
      const m = narrow ? L.narrow : L.wide;
      racks[kind].wide.visible = !narrow;
      racks[kind].narrow.visible = narrow;
      const list = hangers[kind];
      list.forEach((h, i) => {
        const row = Math.floor(i / m.cols);
        const count = Math.min(m.cols, list.length - row * m.cols);
        const drop = L.baseDrop + row * L.rowGap;
        h.pivot.position.set(((i % m.cols) - (count - 1) / 2) * m.gap, m.y, L.z);
        h.pivot.scale.setScalar(m.scale);
        h.g.position.y = -drop;
        h.strings.forEach((s) => {
          s.scale.y = drop - L.topOff;
          s.position.y = -(drop - L.topOff) / 2;
        });
      });
    });
    steles.forEach(({ g, side }) => {
      g.position.x = side * (narrow ? 3.2 : 4.3);
      g.scale.setScalar(narrow ? 0.85 : 1);
    });
  }

  function update(time, hovered, gust) {
    items.forEach((it) => {
      const s = THREE.MathUtils.lerp(it.group.scale.x, hovered === it ? 1.12 : 1, 0.15);
      it.group.scale.setScalar(s);
      if (it.pivot) it.pivot.rotation.z = Math.sin(time + it.phase) * (0.04 + gust * 0.12);
      if (it.mat) it.mat.emissiveIntensity = THREE.MathUtils.lerp(it.mat.emissiveIntensity, hovered === it ? 0.9 : 0.15, 0.15);
    });
    bell.rotation.z = Math.sin(time * 8) * 0.05 * gust;
  }

  return { interactives, setLayout, update };
}
