/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-about. Base block: hero.
 * Source: https://www.deluxe.com/about-us (div.heroimagegen3v1 — side-by-side hero).
 * Generated for xwalk project (field hints: image, text).
 *
 * Simple block (1 column). Model fields: image (+collapsed imageAlt), text (richtext).
 * Per the Hero library description the table has 1 column and (up to) 3 rows:
 *   - row 1: block name
 *   - row 2 (field:image): the side image
 *   - row 3 (field:text):  eyebrow label + H1 title + description paragraph
 *
 * Source structure: div.herofullwidth-sidebyside-image-gen3-v1 with
 *   __bgimage (img), and __contents-details holding __label (p eyebrow),
 *   __title (h1), and __description (p).
 */
export default function parse(element, { document }) {
  const root = element.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1, [class*="herofullwidth"]',
  ) || element;

  // --- Image (field:image) ---
  const image = root.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1__bgimage img, [class*="bgimage"] img, img',
  );

  // --- Text content (field:text): eyebrow + title + description ---
  const details = root.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1__contents-details, [class*="contents-details"]',
  ) || root;

  const labelEl = details.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1__contents-details__label, [class*="__label"]',
  );
  const titleEl = details.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1__contents-details__title, [class*="__title"], h1, h2',
  );
  const descEl = details.querySelector(
    '.herofullwidth-sidebyside-image-gen3-v1__contents-details__description, [class*="__description"]',
  );

  const textNodes = [];

  // Eyebrow label — keep as an emphasised paragraph above the heading.
  if (labelEl) {
    const p = document.createElement('p');
    p.textContent = labelEl.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) textNodes.push(p);
  }

  // Title — normalise to a real <h1> (source wraps a <p> inside the heading).
  if (titleEl) {
    const h1 = document.createElement('h1');
    h1.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    if (h1.textContent) textNodes.push(h1);
  }

  // Description — preserve the paragraph(s).
  if (descEl) {
    const paras = Array.from(descEl.querySelectorAll('p'));
    if (paras.length) {
      paras.forEach((p) => {
        if (p.textContent.replace(/\s+/g, ' ').trim()) textNodes.push(p);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) textNodes.push(p);
    }
  }

  // Empty-block guard.
  if (!image && textNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: image (field:image). Only emit when an image exists.
  if (image) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(image);
    cells.push([imageFrag]);
  }

  // Row: text content (field:text).
  if (textNodes.length) {
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textNodes.forEach((n) => textFrag.appendChild(n));
    cells.push([textFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-about', cells });
  element.replaceWith(block);
}
