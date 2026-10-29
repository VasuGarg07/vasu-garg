import * as THREE from 'three';
import { SANS, MONO } from './textures.js';

const THEME = { kw: '#c678dd', str: '#98c379', fn: '#61afef', prop: '#e06c75', type: '#e5c07b', lit: '#d19a66', com: '#5c6370', text: '#abb2bf' };
const TOKEN = /(\/\/.*$)|('[^']*')|\b(import|export|const|async|function|await|return|from)\b|\b(true|false|\d+)\b|([A-Za-z_]\w*(?=\())|([a-z_]\w*(?=:))|(\b[A-Z]\w*)|([\s\S])/g;
const KINDS = [null, 'com', 'str', 'kw', 'lit', 'fn', 'prop', 'type', 'text'];

function source({ profile, skills }) {
  const list = (items) => items.slice(0, 3).map((s) => `'${s}'`).join(', ');
  return [
    "import { Engineer, Idea } from './types';",
    '',
    'export const vasu: Engineer = {',
    `  name: '${profile.name}',`,
    `  role: '${profile.title}',`,
    "  experience: '4+ years',",
    `  location: '${profile.location}',`,
    `  frontend: [${list(skills[1].items)}],`,
    `  backend: [${list(skills[2].items)}],`,
    `  openToWork: ${profile.available},`,
    '};',
    '',
    'export async function ship(idea: Idea) {',
    '  const plan = await design(idea, { scalable: true });',
    '  const app = await build(plan, { tests: true, a11y: true });',
    '  return deploy(app); // fast, reliable, production-grade',
    '}',
  ].map((line) => {
    const tokens = [];
    for (const m of line.matchAll(TOKEN)) tokens.push([m[0], THEME[KINDS[m.slice(1).findIndex(Boolean) + 1]]]);
    return { line, tokens };
  });
}

const TERMINAL = [
  ['$ npm run build', '#e6e6e6'],
  ['> vite build', '#8b919c'],
  ['✓ 128 modules transformed.', '#98c379'],
  ['dist/index.html      1.21 kB │ gzip: 0.62 kB', '#8b919c'],
  ['✓ built in 1.84s', '#98c379'],
  ['$ npm run deploy', '#e6e6e6'],
  ['→ Live at vasu-garg.vercel.app', '#61afef'],
];

export function createScreen(data, onKey) {
  const W = 1280;
  const H = 720;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const code = source(data);
  const flat = code.map((l) => l.line + '\n').join('');
  const total = flat.length;
  const LH = 23;
  const top = 92;
  ctx.font = `16px ${MONO}`;
  const cw = ctx.measureText('M').width;
  let typed = 0;
  let termLines = 0;
  let clock = 0;
  let wait = 1;
  let blink = true;
  let dirty = true;

  function chrome() {
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1b1d23';
    ctx.fillRect(0, 0, W, 32);
    ctx.fillRect(0, 32, 52, H);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(20 + i * 20, 16, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#8b919c';
    ctx.font = `500 13px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText('engineer.ts - portfolio', W / 2, 21);
    ctx.textAlign = 'left';
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = i ? '#5c6370' : '#d7dae0';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 52 + i * 50, 20, 20);
    }
    ctx.fillStyle = '#d7dae0';
    ctx.fillRect(0, 48, 2, 28);

    ctx.fillStyle = '#21252b';
    ctx.fillRect(52, 32, 238, H);
    ctx.fillStyle = '#8b919c';
    ctx.font = `600 11px ${SANS}`;
    ctx.fillText('EXPLORER', 70, 58);
    const tree = [
      ['▾ PORTFOLIO', 0, null],
      ['▾ src', 1, null],
      ['engineer.ts', 2, '#3b82f6'],
      ['projects.ts', 2, '#3b82f6'],
      ['skills.ts', 2, '#3b82f6'],
      ['▸ public', 1, null],
      ['package.json', 1, '#e5c07b'],
      ['README.md', 1, '#61afef'],
    ];
    ctx.font = `14px ${SANS}`;
    tree.forEach(([name, depth, dot], i) => {
      const y = 88 + i * 26;
      if (name === 'engineer.ts') {
        ctx.fillStyle = '#2c313a';
        ctx.fillRect(52, y - 17, 238, 26);
      }
      const x = 66 + depth * 14;
      if (dot) {
        ctx.fillStyle = dot;
        ctx.fillRect(x, y - 10, 8, 8);
      }
      ctx.fillStyle = name === 'engineer.ts' ? '#ffffff' : '#a9afbb';
      ctx.fillText(name, dot ? x + 14 : x, y);
    });

    ctx.fillStyle = '#21252b';
    ctx.fillRect(290, 32, W - 290, 36);
    ctx.fillStyle = '#282c34';
    ctx.fillRect(290, 32, 150, 36);
    ctx.fillStyle = '#528bff';
    ctx.fillRect(290, 32, 150, 2);
    ctx.font = `13px ${SANS}`;
    ctx.fillStyle = '#e6e6e6';
    ctx.fillText('engineer.ts', 318, 55);
    ctx.fillStyle = '#7f8691';
    ctx.fillText('projects.ts', 468, 55);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(302, 45, 8, 8);

    ctx.fillStyle = '#2f6fdf';
    ctx.fillRect(0, H - 24, W, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = `12px ${SANS}`;
    ctx.fillText('⎇ main    ✓ 0 problems', 14, H - 8);
    ctx.textAlign = 'right';
    ctx.fillText('TypeScript    UTF-8    Prettier', W - 14, H - 8);
    ctx.textAlign = 'left';
  }

  function draw() {
    chrome();
    ctx.font = `16px ${MONO}`;
    let left = typed;
    let cursor = null;
    code.forEach(({ line, tokens }, i) => {
      const y = top + i * LH;
      ctx.fillStyle = '#495162';
      ctx.textAlign = 'right';
      ctx.fillText(String(i + 1), 336, y);
      ctx.textAlign = 'left';
      if (left < 0) return;
      let x = 356;
      let budget = Math.min(left, line.length);
      for (const [text, color] of tokens) {
        if (budget <= 0) break;
        const part = text.slice(0, budget);
        ctx.fillStyle = color;
        ctx.fillText(part, x, y);
        x += part.length * cw;
        budget -= part.length;
      }
      if (left <= line.length) cursor = [x, y];
      left -= line.length + 1;
    });
    if (cursor && blink) {
      ctx.fillStyle = '#528bff';
      ctx.fillRect(cursor[0] + 1, cursor[1] - 15, 2, 20);
    }

    const ty = 500;
    ctx.fillStyle = '#21252b';
    ctx.fillRect(290, ty, W - 290, H - 24 - ty);
    ctx.fillStyle = '#3e4451';
    ctx.fillRect(290, ty, W - 290, 1);
    ctx.font = `600 11px ${SANS}`;
    ['PROBLEMS', 'OUTPUT', 'TERMINAL'].forEach((t, i) => {
      ctx.fillStyle = i === 2 ? '#e6e6e6' : '#7f8691';
      ctx.fillText(t, 310 + i * 96, ty + 24);
    });
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(502, ty + 30, 62, 1);
    ctx.font = `14px ${MONO}`;
    TERMINAL.slice(0, termLines).forEach(([t, c], i) => {
      ctx.fillStyle = c;
      ctx.fillText(t, 310, ty + 58 + i * 21);
    });
    texture.needsUpdate = true;
  }

  function update(dt) {
    clock += dt;
    const nextBlink = clock % 1.06 < 0.53;
    if (nextBlink !== blink) {
      blink = nextBlink;
      dirty = true;
    }
    wait -= dt;
    if (wait <= 0) {
      dirty = true;
      if (typed < total) {
        const ch = flat[typed++];
        wait = ch === '\n' ? 0.28 : 0.025 + Math.random() * 0.06;
        if (ch.trim()) onKey();
      } else if (termLines < TERMINAL.length) {
        termLines++;
        wait = termLines === TERMINAL.length ? 6 : termLines === 1 || termLines === 6 ? 0.9 : 0.35;
      } else {
        typed = 0;
        termLines = 0;
        wait = 0.8;
      }
    }
    if (dirty) {
      draw();
      dirty = false;
    }
  }

  return { texture, update };
}

export function createPhoneScreen(profile) {
  const W = 400;
  const H = 860;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  function draw() {
    const now = new Date();
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#1d2b64');
    g.addColorStop(0.55, '#4b2c6b');
    g.addColorStop(1, '#c0714f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.font = `500 22px ${SANS}`;
    ctx.fillText(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), W / 2, 130);
    ctx.font = `300 112px ${SANS}`;
    ctx.fillText(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), W / 2, 240);

    ctx.fillStyle = 'rgba(20, 20, 30, 0.55)';
    ctx.beginPath();
    ctx.roundRect(22, 330, W - 44, 150, 24);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(42, 352, 44, 44, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `600 26px ${SANS}`;
    ctx.fillText('✉', 64, 384);
    ctx.textAlign = 'left';
    ctx.font = `600 19px ${SANS}`;
    ctx.fillText(profile.name, 100, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `15px ${SANS}`;
    ctx.fillText('now', W - 72, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = `17px ${SANS}`;
    ctx.fillText('Open to new opportunities.', 100, 398);
    ctx.fillText("Let's build something great", 100, 424);
    ctx.fillText('together. Say hello! 👋', 100, 450);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    [70, W - 70].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, H - 110, 32, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 70, H - 30, 140, 6, 3);
    ctx.fill();
    texture.needsUpdate = true;
  }
  draw();
  setInterval(draw, 20000);
  return texture;
}
