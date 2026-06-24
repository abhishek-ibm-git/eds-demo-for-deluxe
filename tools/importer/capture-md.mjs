/* eslint-disable no-console */
/**
 * Capture block-table markdown for a single URL by reusing the helix-importer
 * bundle + the project's bundled import script (same pipeline as run-bulk-import.js),
 * then write the markdown to disk. This md (with EDS block gridtables) is the
 * correct input for md2jcr.
 *
 * Usage: node capture-md.mjs <importBundle> <url> <outMd>
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { chromium } from 'playwright';

const [, , importBundlePath, url, outMd] = process.argv;

const HELIX = resolve(
  '/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts/static/inject/helix-importer.js',
);
const helixImporterScript = readFileSync(HELIX, 'utf-8');
const importScriptContent = readFileSync(resolve(importBundlePath), 'utf-8');

const baseArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

async function launch(disableHttp2) {
  const args = disableHttp2 ? [...baseArgs, '--disable-http2'] : baseArgs;
  try {
    const b = await chromium.launch({ headless: true, args, channel: 'chrome' });
    console.log('  Browser: Chrome');
    return b;
  } catch {
    console.log('  Browser: Chromium (bundled)');
    return chromium.launch({ headless: true, args });
  }
}

function isHttp2(err) {
  return /ERR_HTTP2_PROTOCOL_ERROR|ERR_SPDY_PROTOCOL_ERROR|ERR_HTTP2_PING_FAILED/.test(err?.message || '');
}

async function navigate(page) {
  let lastErr;
  for (let i = 0; i < 4; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);
      return;
    } catch (err) {
      lastErr = err;
      if (isHttp2(err)) throw err;
      console.log(`  goto attempt ${i + 1} failed (${err.name}); retrying...`);
      await page.waitForTimeout(2000);
    }
  }
  throw lastErr;
}

let browser = await launch(false);
let context = await browser.newContext({ bypassCSP: true, viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
let page = await context.newPage();
page.on('console', (msg) => { if (msg.type() === 'error') console.error(`[Browser] ${msg.text()}`); });

try {
  try {
    await navigate(page);
  } catch (err) {
    if (!isHttp2(err)) throw err;
    console.log('  HTTP/2 error — relaunching with --disable-http2');
    await browser.close();
    browser = await launch(true);
    context = await browser.newContext({ bypassCSP: true, viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
    page = await context.newPage();
    page.on('console', (msg) => { if (msg.type() === 'error') console.error(`[Browser] ${msg.text()}`); });
    await navigate(page);
  }

  await page.evaluate((script) => {
    const originalDefine = window.define;
    if (typeof window.define !== 'undefined') delete window.define;
    const el = document.createElement('script');
    el.textContent = script;
    document.head.appendChild(el);
    if (originalDefine) window.define = originalDefine;
  }, helixImporterScript);

  await page.evaluate((script) => {
    const el = document.createElement('script');
    el.textContent = script;
    document.head.appendChild(el);
  }, importScriptContent);

  await page.waitForFunction(
    () => typeof window.CustomImportScript !== 'undefined' && window.CustomImportScript?.default,
    { timeout: 10000 },
  );

  const result = await page.evaluate(async (pageUrl) => {
    const cfg = window.CustomImportScript.default;
    if (typeof cfg.onLoad === 'function') await cfg.onLoad({ document });
    const res = await window.WebImporter.html2md(pageUrl, document, cfg, {
      toDocx: false,
      toMd: true,
      originalURL: pageUrl,
    });
    return { md: res.md, path: res.path };
  }, url);

  mkdirSync(dirname(resolve(outMd)), { recursive: true });
  writeFileSync(resolve(outMd), result.md, 'utf-8');
  console.log(`Wrote markdown (${result.md.length} bytes) to ${outMd}; docPath=${result.path}`);
} finally {
  await browser.close();
}
