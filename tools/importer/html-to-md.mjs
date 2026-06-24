/* eslint-disable no-console */
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { html2md } from '@adobe/helix-importer';

// Usage: node html-to-md.mjs <input.plain.html> <output.md> <originalUrl>
const [, , inHtml, outMd, originalUrl] = process.argv;

const fragment = await readFile(path.resolve(inHtml), 'utf-8');
const fullHtml = `<!DOCTYPE html><html><head></head><body>${fragment}</body></html>`;

const config = {
  createDocumentFromString: (html) => new JSDOM(html).window.document,
};

const res = await html2md(originalUrl, fullHtml, null, config, {});
await writeFile(path.resolve(outMd), res.md, 'utf-8');
console.log(`Wrote markdown to ${outMd} (${res.md.length} bytes)`);
