import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { root } from './build.mjs';
import { createPreviewServer } from './preview-server.mjs';

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
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
const server = createPreviewServer();
server.listen(port, host, () => console.log(`Portfolio: http://${host}:${server.address().port}`));
server.on('error', error => { console.error(error.message); process.exit(1); });
if (process.argv.includes('--watch')) {
  let timer;
  watch(resolve(root, 'src'), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
  console.log('Watching src/. Refresh your browser after changes.');
}
