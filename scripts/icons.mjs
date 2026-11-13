import { writeFile, mkdir } from 'node:fs/promises';

const ICONS = {
  javascript: 'javascript/javascript-original',
  typescript: 'typescript/typescript-original',
  python: 'python/python-original',
  html: 'html5/html5-original',
  css: 'css3/css3-original',
  angular: 'angular/angular-original',
  react: 'react/react-original',
  nextjs: 'nextjs/nextjs-original',
  tailwindcss: 'tailwindcss/tailwindcss-original',
  nodejs: 'nodejs/nodejs-original',
  express: 'express/express-original',
  fastapi: 'fastapi/fastapi-original',
  graphql: 'graphql/graphql-plain',
  postgresql: 'postgresql/postgresql-original',
  mongodb: 'mongodb/mongodb-original',
  firebase: 'firebase/firebase-original',
  aws: 'amazonwebservices/amazonwebservices-original',
  docker: 'docker/docker-original',
  git: 'git/git-original',
  github: 'github/github-original',
  githubactions: 'githubactions/githubactions-original',
  postman: 'postman/postman-original',
};

const { version } = await (await fetch('https://registry.npmjs.org/devicon/latest')).json();
const base = `https://cdn.jsdelivr.net/npm/devicon@${version}/icons`;
const dir = new URL('../public/skills/', import.meta.url);
await mkdir(dir, { recursive: true });

const failed = [];
await Promise.all(
  Object.entries(ICONS).map(async ([name, path]) => {
    const res = await fetch(`${base}/${path}.svg`);
    const svg = await res.text();
    if (!res.ok || !svg.trimStart().startsWith('<svg') || /<script|on\w+=/i.test(svg)) return failed.push(`${name} (${res.status})`);
    await writeFile(new URL(`${name}.svg`, dir), svg);
  }),
);

console.log(`Devicon ${version}: saved ${Object.keys(ICONS).length - failed.length} icons to public/skills/`);
if (failed.length) {
  console.error(`Kept the existing file for: ${failed.join(', ')}`);
  process.exitCode = 1;
}
