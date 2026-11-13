import * as THREE from 'three';

export const SANS = "'Inter', 'Segoe UI', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', Consolas, monospace";

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function canvasTex(w, h, draw, { repeat, color = true } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

export function repeated(tex, x, y) {
  const copy = tex.clone();
  copy.wrapS = copy.wrapT = THREE.RepeatWrapping;
  copy.repeat.set(x, y);
  copy.needsUpdate = true;
  return copy;
}

function noise(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function grain(ctx, x, y, w, h, base, dark, light, lines) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  for (let i = 0; i < lines; i++) {
    const gy = y + Math.random() * h;
    const amp = rand(1, h * 0.03);
    const freq = rand(0.002, 0.008);
    const phase = rand(0, 6);
    ctx.strokeStyle = Math.random() < 0.8 ? dark : light;
    ctx.globalAlpha = rand(0.04, 0.2);
    ctx.lineWidth = rand(0.6, 3);
    ctx.beginPath();
    for (let gx = 0; gx <= w; gx += 8) {
      const yy = gy + Math.sin(gx * freq + phase) * amp + Math.sin(gx * freq * 3.3 + phase) * amp * 0.25;
      if (gx === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x + gx, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

export const walnut = () =>
  canvasTex(2048, 1024, (ctx, w, h) => {
    grain(ctx, 0, 0, w, h, '#5b3b25', '#26140a', '#8a5c3b', 420);
    noise(ctx, w, h, 12);
  });

export const oak = () =>
  canvasTex(1024, 256, (ctx, w, h) => {
    grain(ctx, 0, 0, w, h, '#b48a5e', '#6e4a2a', '#d6b088', 160);
    noise(ctx, w, h, 10);
  });

export const planks = () =>
  canvasTex(1024, 1024, (ctx, w, h) => {
    const rows = 6;
    const rowH = h / rows;
    const tones = ['#8f6a47', '#9c7651', '#86613f', '#a07c57', '#7f5b3b'];
    for (let r = 0; r < rows; r++) {
      const seam = rand(0.25, 0.75) * w;
      [[0, seam], [seam, w - seam]].forEach(([x, len]) => {
        grain(ctx, x, r * rowH, len, rowH, pick(tones), '#3d2716', '#c49a6c', 40);
        ctx.fillStyle = 'rgba(20, 12, 6, 0.55)';
        ctx.fillRect(x, r * rowH, 2, rowH);
      });
      ctx.fillStyle = 'rgba(20, 12, 6, 0.6)';
      ctx.fillRect(0, r * rowH, w, 2);
    }
    noise(ctx, w, h, 10);
  });

export const plaster = (color) =>
  canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 9);
  });

export const felt = () =>
  canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#26282c';
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 16);
  });

export const rug = () =>
  canvasTex(1024, 704, (ctx, w, h) => {
    ctx.fillStyle = '#3a3f4a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#8a8274';
    ctx.fillRect(46, 46, w - 92, h - 92);
    ctx.strokeStyle = '#c9bfa9';
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, w - 140, h - 140);
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1;
    for (let i = 0; i < w + h; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    noise(ctx, w, h, 26);
  });

export const blob = () =>
  canvasTex(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

export const leaf = () =>
  canvasTex(128, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#c8b74a');
    g.addColorStop(0.12, '#2f5a2b');
    g.addColorStop(0.5, '#3d6e35');
    g.addColorStop(0.88, '#2f5a2b');
    g.addColorStop(1, '#c8b74a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(16, 38, 18, 0.55)';
    for (let y = 0; y < h; y += rand(10, 22)) {
      ctx.lineWidth = rand(2, 5);
      ctx.beginPath();
      for (let x = 14; x <= w - 14; x += 6) ctx.lineTo(x, y + Math.sin(x * 0.12 + y) * 4);
      ctx.stroke();
    }
    noise(ctx, w, h, 14);
  });

export const skyline = () =>
  canvasTex(2048, 1024, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#060914');
    sky.addColorStop(0.55, '#141a33');
    sky.addColorStop(0.8, '#3a2c45');
    sky.addColorStop(1, '#5a3a3a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rand(0.2, 0.8)})`;
      ctx.fillRect(Math.random() * w, Math.random() * h * 0.5, rand(1, 2.4), rand(1, 2.4));
    }
    const moon = ctx.createRadialGradient(1500, 210, 0, 1500, 210, 160);
    moon.addColorStop(0, 'rgba(255,248,230,1)');
    moon.addColorStop(0.28, 'rgba(255,244,220,0.95)');
    moon.addColorStop(0.32, 'rgba(200,210,255,0.18)');
    moon.addColorStop(1, 'rgba(200,210,255,0)');
    ctx.fillStyle = moon;
    ctx.fillRect(1300, 10, 400, 400);
    [['#1b1f33', 0.42, 0.25], ['#11142a', 0.55, 0.45], ['#090b18', 0.68, 0.8]].forEach(([color, top, lit]) => {
      let x = -20;
      while (x < w) {
        const bw = rand(40, 120);
        const bh = rand(0.12, 0.5) * h;
        const y = h * top + rand(0, 0.2) * h - bh * 0.3;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, bw, h - y);
        for (let wy = y + 10; wy < h - 8; wy += 11) {
          for (let wx = x + 6; wx < x + bw - 8; wx += 9) {
            if (Math.random() < lit * 0.35) {
              ctx.fillStyle = pick(['#ffd9a0', '#ffe8c2', '#ffcf86', '#cfe2ff']);
              ctx.globalAlpha = rand(0.45, 0.95);
              ctx.fillRect(wx, wy, 4, 6);
              ctx.globalAlpha = 1;
            }
          }
        }
        x += bw + rand(4, 30);
      }
    });
  });

export const spine = (title, bg, fg, tall) =>
  canvasTex(96, Math.round(96 * tall), (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(0, h * 0.06, w, 5);
    ctx.fillRect(0, h * 0.94 - 5, w, 5);
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `600 30px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title.toUpperCase(), 0, 1, h * 0.78);
    ctx.restore();
    noise(ctx, w, h, 12);
  });

export const clockFace = () =>
  canvasTex(512, 512, (ctx, w) => {
    const c = w / 2;
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, w);
    ctx.fillStyle = '#1c1d20';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const major = i % 5 === 0;
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(a);
      ctx.fillRect(major ? -4 : -1.5, -c * 0.9, major ? 8 : 3, major ? 34 : 14);
      ctx.restore();
    }
    ctx.font = `600 26px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText('VG', c, c + 90);
  });

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function pin(ctx, x, y, color) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.arc(x + 4, y + 6, 11, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(x - 3, y - 4, 1, x, y, 12);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.3, color);
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
}

function note(ctx, x, y, w, h, rot, bg, draw) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = bg;
  roundRect(ctx, -w / 2, -h / 2, w, h, 4);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.translate(-w / 2, -h / 2);
  draw(ctx, w, h);
  pin(ctx, w / 2, 20, '#d64534');
  ctx.restore();
}

function lines(ctx, text, x, y, maxW, lineH) {
  let line = '';
  text.split(' ').forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      ctx.fillText(line, x, y);
      y += lineH;
      line = word;
    } else line = next;
  });
  ctx.fillText(line, x, y);
  return y;
}

export const corkboard = ({ experience, education, stats }) =>
  canvasTex(1440, 1000, (ctx, w, h) => {
    ctx.fillStyle = '#b48552';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26000; i++) {
      ctx.fillStyle = pick(['#8c5f33', '#cfa06a', '#9b6b3c', '#6f4724', '#dcb07a']);
      ctx.globalAlpha = rand(0.3, 0.8);
      ctx.fillRect(Math.random() * w, Math.random() * h, rand(1, 4), rand(1, 4));
    }
    ctx.globalAlpha = 1;
    noise(ctx, w, h, 20);

    const cards = [...experience].reverse().map((e, i) => ({ e, x: 40 + i * 460, y: 80 + (i % 2) * 40, rot: i % 2 ? 0.025 : -0.02 }));
    ctx.strokeStyle = '#b8322a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    cards.forEach((c, i) => (i ? ctx.lineTo(c.x + 200, c.y + 20) : ctx.moveTo(c.x + 200, c.y + 20)));
    ctx.stroke();

    cards.forEach(({ e, x, y, rot }) => {
      note(ctx, x, y, 400, 300, rot, '#f7f4ec', (c, cw) => {
        c.fillStyle = '#b8322a';
        c.fillRect(0, 48, cw, 3);
        c.fillStyle = '#7a7f8a';
        c.font = `500 22px ${MONO}`;
        c.fillText(e.period.toUpperCase(), 28, 92);
        c.fillStyle = '#1b1d22';
        c.font = `700 34px ${SANS}`;
        const last = lines(c, e.role, 28, 140, cw - 56, 40);
        c.fillStyle = '#3d4250';
        c.font = `500 26px ${SANS}`;
        c.fillText(e.company, 28, last + 52, cw - 56);
        if (e.current) {
          c.fillStyle = '#2f8a5b';
          c.font = `600 20px ${SANS}`;
          c.fillText('● CURRENT', 28, last + 90);
        }
      });
    });

    const ed = education[0];
    note(ctx, 1000, 470, 360, 290, 0.03, '#dbe8f5', (c, cw) => {
      c.fillStyle = '#1b2b45';
      c.font = `500 20px ${MONO}`;
      c.fillText(ed.period, 26, 80);
      c.font = `700 28px ${SANS}`;
      const last = lines(c, ed.degree, 26, 122, cw - 52, 34);
      c.font = `500 20px ${SANS}`;
      lines(c, ed.institution, 26, last + 38, cw - 52, 26);
    });

    const stickies = [
      ['#ffe066', stats[0].value, stats[0].label],
      ['#ffb3c7', stats[1].value, stats[1].label],
      ['#a7f3d0', stats[2].value, stats[2].label],
    ];
    stickies.forEach(([bg, value, label], i) => {
      note(ctx, 90 + i * 300, 500 + (i % 2) * 70, 230, 230, (i - 1) * 0.06, bg, (c, cw) => {
        c.fillStyle = '#26272b';
        c.textAlign = 'center';
        c.font = `800 64px ${SANS}`;
        c.fillText(value, cw / 2, 125);
        c.font = `500 24px ${SANS}`;
        c.fillText(label, cw / 2, 170, cw - 28);
        c.textAlign = 'left';
      });
    });

    note(ctx, 1050, 790, 300, 160, -0.04, '#fff', (c, cw) => {
      c.fillStyle = '#26272b';
      c.font = `600 26px ${SANS}`;
      c.textAlign = 'center';
      c.fillText('Clean code > clever code', cw / 2, 95, cw - 30);
      c.textAlign = 'left';
    });
  });
