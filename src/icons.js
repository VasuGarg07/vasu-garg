const LOGOS = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  HTML: 'html',
  CSS: 'css',
  Angular: 'angular',
  React: 'react',
  'Next.js': 'nextjs',
  'React-Native': 'react',
  'React Native': 'react',
  'Tailwind CSS': 'tailwindcss',
  'Node.js': 'nodejs',
  Express: 'express',
  FastAPI: 'fastapi',
  GraphQL: 'graphql',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  Firebase: 'firebase',
  'Google Firebase': 'firebase',
  AWS: 'aws',
  Docker: 'docker',
  Git: 'git',
  GitHub: 'github',
  'GitHub Actions': 'githubactions',
  Postman: 'postman',
};

const GENERIC = {
  'REST APIs': '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/><path d="M4 6h6"/><path d="M4 18h6"/>',
  WebSockets: '<path d="M7 7h10l-3-3"/><path d="M17 17H7l3 3"/>',
};

export function skillIcon(name) {
  const file = LOGOS[name];
  if (file) return `<img src="${import.meta.env.BASE_URL}skills/${file}.svg" alt="" width="22" height="22" loading="lazy">`;
  const generic = GENERIC[name] || '<circle cx="12" cy="12" r="4"/>';
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${generic}</svg>`;
}

const ARROW = '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>';
const LINE = {
  arrow: ARROW,
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
};

export const icon = (name, size = 18) =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${LINE[name]}</svg>`;

function slab(o, top, face, shade) {
  const t = `<path d="M32 ${6 + o} 54 ${17 + o} 32 ${28 + o} 10 ${17 + o}Z" fill="${top}"/>`;
  const l = `<path d="M10 ${17 + o} 32 ${28 + o} 32 ${33 + o} 10 ${22 + o}Z" fill="${face}"/>`;
  const r = `<path d="M32 ${28 + o} 54 ${17 + o} 54 ${22 + o} 32 ${33 + o}Z" fill="${face}"/>`;
  const dim = shade
    ? `<path d="M10 ${17 + o} 32 ${28 + o} 32 ${33 + o} 10 ${22 + o}Z" fill="#000" fill-opacity=".18"/><path d="M32 ${28 + o} 54 ${17 + o} 54 ${22 + o} 32 ${33 + o}Z" fill="#000" fill-opacity=".32"/>`
    : '';
  return t + l + r + dim;
}

export function logoMark(size, dark) {
  const bottom = dark ? ['#5A6578', '#3B4658'] : ['#C9D1DE', '#A9B4C6'];
  const middle = dark ? ['#FFFFFF', '#C9D1DE'] : ['#0E1525', '#2A3550'];
  return `<svg role="img" aria-label="Vasu Garg logo" width="${size}" height="${size}" viewBox="0 0 64 64">${slab(22, ...bottom)}${slab(11, ...middle)}${slab(0, '#2447E6', '#2447E6', true)}</svg>`;
}
