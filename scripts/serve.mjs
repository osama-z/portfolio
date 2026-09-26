import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { root } from './build.mjs';

const directory = resolve(root, 'dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
let building = false;
let queued = false;
async function rebuild() {
  if (building) { queued = true; return; }
  building = true;
  const code = await new Promise((resolveCode) => {
    const child = spawn(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
    child.on('error', () => resolveCode(1));
    child.on('exit', resolveCode);
  });
  building = false;
  if (queued) { queued = false; await rebuild(); }
  return code;
}

if (await rebuild() !== 0) process.exit(1);
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(directory, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
    if (!target.startsWith(directory + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if (!(await stat(target)).isFile()) throw new Error('Not a file');
    const content = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(content);
  } catch {
    const page = await readFile(resolve(directory, '404.html'), 'utf8');
    // Keep the custom error page usable for missing nested URLs.
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page.replace('<head>', '<head><base href="/">'));
  }
});
server.listen(port, host, () => console.log(`Portfolio: http://${host}:${port}`));
server.on('error', error => { console.error(error.message); process.exit(1); });
if (process.argv.includes('--watch')) {
  let timer;
  watch(resolve(root, 'src'), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
  console.log('Watching src/. Refresh your browser after changes.');
}
