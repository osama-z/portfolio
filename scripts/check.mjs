import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { build, root } from './build.mjs';
import { pages } from '../src/pages/index.mjs';

const routes = Object.keys(pages);

await build();
let checked = 0;
for (const route of routes) {
  const html = await readFile(resolve(root, 'dist', route), 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route}: exactly one main heading`);
  assert.ok(html.includes('<html lang="en">'), `${route}: document language`);
  assert.ok(html.includes('id="main"'), `${route}: main landmark`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1];
    if (/^https?:|^data:|^mailto:/.test(link)) continue;
    const [file, fragment] = link.split('#');
    const target = resolve(root, 'dist', file || route);
    await access(target).catch(() => assert.fail(`${route}: missing ${link}`));
    if (fragment) {
      const targetHtml = await readFile(target, 'utf8');
      assert.ok(targetHtml.includes(`id="${fragment}"`), `${route}: broken anchor ${link}`);
    }
    checked++;
  }
}
const stylesheet = await readFile(resolve(root, 'dist/assets/styles.css'), 'utf8');
for (const match of stylesheet.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  await access(resolve(root, 'dist/assets', match[1]));
}
console.log(`Passed: ${routes.length} pages, ${checked} internal links/assets, headings, anchors, and font assets.`);
