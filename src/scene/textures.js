import * as THREE from 'three';

export const SANS = "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', Consolas, monospace";

function canvasTex(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  draw(ctx, w, h, tex);
  return tex;
}

function wrap(ctx, text, maxW) {
  const lines = [];
  let line = '';
  text.split(' ').forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  lines.push(line);
  return lines;
}

export const sky = () =>
  canvasTex(4, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#86c3ff');
    g.addColorStop(0.55, '#cfe8ff');
    g.addColorStop(1, '#ffe7d2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

export const facade = (w, h, wall, name) =>
  canvasTex(Math.round(w * 96), Math.round(h * 96), (ctx, W, H) => {
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(24, 28, 46, 0.86)';
    ctx.fillRect(0, 12, W, 52);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 15px ${SANS}`;
    ctx.textAlign = 'center';
    const lines = wrap(ctx, name, W - 12).slice(0, 2);
    lines.forEach((line, i) => ctx.fillText(line, W / 2, 44 - (lines.length - 1) * 9 + i * 18, W - 8));

    const cols = Math.max(2, Math.round(w / 0.32));
    const cw = W / cols;
    for (let y = 86; y < H - 52; y += 34) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = ['#ffffff', '#dff3ff', '#bfe6ff', '#fff3c4'][Math.floor(Math.random() * 4)];
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.roundRect(c * cw + cw * 0.2, y, cw * 0.6, 20, 3);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(24, 28, 46, 0.86)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 13, H - 34, 26, 34, [5, 5, 0, 0]);
    ctx.fill();
  });

export const sign = (title, subtitle, bg) =>
  canvasTex(512, 176, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `800 46px ${SANS}`;
    ctx.fillText(title, w / 2, 78, w - 40);
    ctx.globalAlpha = 0.85;
    ctx.font = `500 28px ${MONO}`;
    ctx.fillText(subtitle, w / 2, 132, w - 40);
  });

export const rack = (label) =>
  canvasTex(128, 368, (ctx, w, h) => {
    ctx.fillStyle = '#262b3a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let y = 14; y < h - 10; y += 12) ctx.fillRect(86, y, 30, 5);
    ctx.translate(46, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 26px ${SANS}`;
    ctx.fillText(label.toUpperCase(), 0, 0, h - 30);
  });

export const billboard = (profile, photoUrl) =>
  canvasTex(768, 432, (ctx, w, h, tex) => {
    const draw = (photo) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#5b5bf0';
      ctx.fillRect(0, 0, w, 14);
      ctx.save();
      ctx.beginPath();
      ctx.arc(150, 222, 104, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#e4e6ff';
      ctx.fillRect(40, 110, 220, 220);
      if (photo) ctx.drawImage(photo, 46, 118, 208, 208);
      ctx.restore();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1b2030';
      ctx.font = `800 62px ${SANS}`;
      ctx.fillText(profile.name, 290, 196, 450);
      ctx.fillStyle = '#5f667a';
      ctx.font = `500 32px ${SANS}`;
      ctx.fillText(profile.title, 292, 246, 450);
      if (profile.available) {
        ctx.fillStyle = '#dff7e6';
        ctx.beginPath();
        ctx.roundRect(290, 276, 268, 54, 27);
        ctx.fill();
        ctx.fillStyle = '#1f9d55';
        ctx.beginPath();
        ctx.arc(318, 303, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `700 26px ${SANS}`;
        ctx.fillText('Open to work', 338, 312);
      }
      tex.needsUpdate = true;
    };
    draw(null);
    const img = new Image();
    img.onload = () => draw(img);
    img.src = photoUrl;
  });
