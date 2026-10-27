import * as THREE from 'three';

export const HALF = Math.PI / 2;
export const FONTS = {
  serif: "'Shippori Mincho', 'Yu Mincho', 'Noto Serif JP', serif",
  sans: "'Zen Kaku Gothic New', 'Segoe UI', system-ui, sans-serif",
};

export function add(parent, geo, mat, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

export const cyl = (rt, rb, h, s = 16) => new THREE.CylinderGeometry(rt, rb, h, s);
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

export function canvasTex(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function wrap(ctx, text, maxW) {
  const lines = [];
  let line = '';
  text.split(' ').forEach((word) => {
    const next = line ? line + ' ' + word : word;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  lines.push(line);
  return lines;
}
