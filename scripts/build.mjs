import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));

export async function build() {
  // The development server starts a fresh build process for each source change.
  const { pages } = await import('../src/pages/index.mjs');
  await rm(join(root, 'dist'), { recursive: true, force: true });
  await mkdir(join(root, 'dist'), { recursive: true });
  await cp(join(root, 'src/assets'), join(root, 'dist/assets'), { recursive: true });
  await cp(join(root, 'src/styles/main.css'), join(root, 'dist/assets/styles.css'));
  await cp(join(root, 'src/scripts/main.js'), join(root, 'dist/assets/main.js'));
  for (const [name, html] of Object.entries(pages)) {
    await writeFile(join(root, 'dist', name), html);
  }
  await writeFile(join(root, 'dist/.nojekyll'), '');
  await writeFile(join(root, 'dist/robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://osama-z.github.io/portfolio/sitemap.xml\n');
  const urls = Object.keys(pages).filter(name => name !== '404.html').map(name => `<url><loc>https://osama-z.github.io/portfolio/${name === 'index.html' ? '' : name}</loc></url>`).join('');
  await writeFile(join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  console.log(`Built ${Object.keys(pages).length} pages into dist/.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
