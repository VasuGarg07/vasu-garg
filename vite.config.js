const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
process.env.VITE_SITE_URL ??= vercelUrl ? `https://${vercelUrl}` : 'https://vasugarg07.vercel.app';

export default {
  base: './',
};
