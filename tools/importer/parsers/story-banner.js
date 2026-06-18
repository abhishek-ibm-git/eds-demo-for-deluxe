/* eslint-disable */
/* global WebImporter */
/**
 * Parser for story-banner. Custom block (Deluxe "Payments and Data" story banner).
 * Source: https://www.deluxe.com/ (div.homestorybannergen3v1 > .home-story-banner)
 *
 * Two-row block matching blocks/story-banner/story-banner.js decoration:
 *   - row 1 (text cell):  eyebrow label + H2 heading + description + CTA button
 *   - row 2 (video cell): link to the globe background video (.mp4)
 */
export default function parse(element, { document }) {
  const root = element.querySelector('.home-story-banner') || element;

  // --- Text cell ---
  const label = root.querySelector('.home-story-banner__label');
  const title = root.querySelector('.home-story-banner__title');
  const body = root.querySelector('.home-story-banner__bodycopy');
  const cta = root.querySelector('.home-story-banner__cta a');

  const textFrag = document.createDocumentFragment();

  if (label) {
    const p = document.createElement('p');
    p.textContent = label.textContent.trim();
    textFrag.appendChild(p);
  }
  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    textFrag.appendChild(h2);
  }
  if (body) {
    const p = document.createElement('p');
    p.textContent = body.textContent.trim();
    textFrag.appendChild(p);
  }
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href') || '#');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textFrag.appendChild(p);
  }

  // --- Video cell ---
  // Resolve the globe video src and emit it as an absolute deluxe.com URL. The
  // DAM asset is too large to host locally and the CDN serves it with CORS, so
  // the migrated site loads it cross-origin directly from the source.
  const source = root.querySelector('.home-story-banner__globe-content video source, video source, video');
  let videoSrc = source
    ? (source.getAttribute('src') || source.querySelector('source')?.getAttribute('src'))
    : null;
  if (videoSrc && videoSrc.startsWith('/')) {
    videoSrc = `https://www.deluxe.com${videoSrc}`;
  }

  const videoFrag = document.createDocumentFragment();
  if (videoSrc) {
    const a = document.createElement('a');
    a.setAttribute('href', videoSrc);
    a.textContent = videoSrc;
    videoFrag.appendChild(a);
  }

  // Empty-block guard.
  if (!label && !title && !body && !videoSrc) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textFrag], [videoFrag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'story-banner', cells });
  element.replaceWith(block);
}
