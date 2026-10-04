import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { build, root } from './build.mjs';
import { createPreviewServer } from './preview-server.mjs';
import { pages } from '../src/pages/index.mjs';
import { chromium } from 'playwright';

const output = join(root, 'output', 'browser-check', new Date().toISOString().replaceAll(':', '-'));
await mkdir(output, { recursive: true });
const report = { status: 'running', checks: [], screenshots: [] };
let server;
let browser;
let stage = 'preview startup';

async function startPreview() {
  await build();
  server = createPreviewServer();
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`));
  });
}

async function check(name, run) {
  try {
    await run();
    report.checks.push({ name, status: 'passed' });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, status: 'failed', error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function capture(page, name) {
  const file = `${name}.png`;
  await page.screenshot({ path: join(output, file), fullPage: true, animations: 'disabled' });
  report.screenshots.push(file);
}

function contrast(foreground, background) {
  const luminance = rgb => {
    const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
      const c = value / 255;
      return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
    });
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

try {
  const baseURL = await startPreview();
  stage = 'browser startup';
  browser = await chromium.launch({ headless: true });
  stage = 'page checks';

  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    try {
      for (const route of Object.keys(pages)) {
        await check(`${route} at ${width}px`, async () => {
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
          page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
          page.on('response', response => {
            if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
          });
          try {
            await page.goto(`${baseURL}/${route}`, { waitUntil: 'networkidle' });
            await page.evaluate(() => document.fonts.ready);
            assert.equal(await page.locator('h1').count(), 1, 'Expected one main heading');
            const geometry = await page.evaluate(() => ({
              content: document.documentElement.scrollWidth,
              viewport: window.innerWidth,
              brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
              fontLoaded: [...document.fonts].some(font => font.family.includes('Portfolio Sans') && font.status === 'loaded'),
            }));
            assert.ok(geometry.content <= geometry.viewport + 1, `Horizontal overflow: ${geometry.content}px in ${geometry.viewport}px`);
            assert.deepEqual(geometry.brokenImages, [], 'Broken images');
            assert.ok(geometry.fontLoaded, 'Portfolio font did not load');
            assert.deepEqual(errors, [], 'Browser errors or failed resources');
            if (route === 'work.html' || route === 'neurontrade.html') await capture(page, `${route.replace('.html', '')}-${width}`);
          } catch (error) {
            await capture(page, `failure-${route.replace('.html', '')}-${width}`).catch(() => {});
            throw error;
          } finally { await page.close(); }
        });
      }
    } finally { await context.close(); }
  }

  await check('NeuronTrade card color, contrast, and navigation', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      await page.goto(`${baseURL}/work.html`);
      const card = page.locator('.project-card a[href="neurontrade.html"]');
      const colors = await card.locator('.project-cover').evaluate(element => {
        const style = getComputedStyle(element);
        return { text: style.color, background: style.backgroundColor };
      });
      const otherBackgrounds = await page.locator('.project-card a:not([href="neurontrade.html"]) .project-cover')
        .evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor));
      assert.ok(!otherBackgrounds.includes(colors.background), 'NeuronTrade must have its own card color');
      const ratio = contrast(colors.text, colors.background);
      assert.ok(ratio >= 4.5, `Card text contrast is only ${ratio.toFixed(2)}:1`);
      report.cardColors = { ...colors, contrastRatio: Number(ratio.toFixed(2)) };
      await card.click();
      await page.waitForURL('**/neurontrade.html');
      assert.equal(await page.locator('.case-cover').evaluate(el => getComputedStyle(el).backgroundColor), colors.background);
      assert.ok(await page.getByRole('heading', { level: 1 }).isVisible());
      assert.ok(await page.getByRole('link', { name: 'View the source' }).isVisible());
    } finally { await page.close(); }
  });

  await check('Mobile menu opens, closes with Escape, and follows links', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(`${baseURL}/neurontrade.html`);
      const menu = page.getByRole('button', { name: 'Menu' });
      const nav = page.locator('#primary-nav');
      assert.equal(await nav.isVisible(), false);
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      assert.ok(await nav.isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await nav.isVisible(), false);
      assert.ok(await menu.evaluate(el => el === document.activeElement));
      await menu.click();
      await nav.getByRole('link', { name: 'My work' }).click();
      await page.waitForURL('**/work.html');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    } finally { await page.close(); }
  });

  await check('Motion preference persists and respects reduced motion', async () => {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    try {
      await page.goto(baseURL);
      await page.getByRole('button', { name: 'Pause motion' }).click();
      await page.reload();
      assert.equal(await page.locator('body').getAttribute('data-motion'), 'paused');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.getByRole('button', { name: 'Reduced motion enabled' }).waitFor();
      assert.ok(await page.getByRole('button', { name: 'Reduced motion enabled' }).isDisabled());
    } finally { await page.close(); }
  });

  report.status = report.checks.some(result => result.status === 'failed') ? 'failed' : 'passed';
} catch (error) {
  report.status = stage === 'page checks' ? 'failed' : 'blocked';
  report.stage = stage;
  report.error = error.message;
  console.error(`${report.status.toUpperCase()} during ${stage}: ${error.message}`);
  if (stage === 'browser startup') console.error('Install Chromium with: npx playwright install chromium');
  if (/EPERM|Operation not permitted/.test(error.message)) {
    console.error('The environment blocks browser/preview connections. Run this command in your normal terminal or the Browser checks GitHub Actions workflow.');
  }
} finally {
  await browser?.close().catch(() => {});
  if (server?.listening) await new Promise(resolve => server.close(resolve));
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`Browser check: ${report.status}. Report: ${relative(root, join(output, 'report.json'))}`);
  if (report.status !== 'passed') process.exitCode = 1;
}
