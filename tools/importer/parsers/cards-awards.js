/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-awards. Base block: cards.
 * Source: https://www.deluxe.com/about-us (div.zoomcardsgen3v1 — "Proven Success"
 * award badges).
 * Generated for xwalk project (field hints: image, text).
 *
 * Container block (cards). Each award badge = one row with two cells:
 *   - cell 1 (field:image): the award badge image
 *   - cell 2 (field:text):  the caption text
 *
 * Source structure: .zoom-cards-gen3-v1__contents-card > article.dx-wallbox holds
 * five .dx-w-item entries, each an <img> badge followed by a <div> caption.
 * The section header (eyebrow .label "PROVEN SUCCESS" + h2 title) is emitted as
 * default content above the block, matching the cards-services/cards-product pattern.
 */
export default function parse(element, { document }) {
  // Each award is a wall-box item.
  let items = Array.from(
    element.querySelectorAll('.dx-wallbox .dx-w-item, [class*="dx-w-item"]'),
  );
  if (!items.length) {
    items = Array.from(element.querySelectorAll('article .dx-w-item'));
  }

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img');
    // Caption is the (first) non-image block-level child.
    const captionEl = item.querySelector('div, p, span');
    const captionText = captionEl ? captionEl.textContent.replace(/\s+/g, ' ').trim() : '';

    if (!img && !captionText) return;

    // --- Image cell (field:image) ---
    let imageCell = '';
    if (img) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      imgFrag.appendChild(img);
      imageCell = imgFrag;
    }

    // --- Text cell (field:text) ---
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (captionText) {
      const p = document.createElement('p');
      p.textContent = captionText;
      textFrag.appendChild(p);
    }

    cells.push([imageCell, textFrag]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-awards', cells });

  // Section header (eyebrow + title) as default content above the block.
  const introFrag = document.createDocumentFragment();
  const labelEl = element.querySelector(
    '.zoom-cards-gen3-v1__contents-details__label, [class*="details__label"]',
  );
  const titleEl = element.querySelector(
    '.zoom-cards-gen3-v1__contents-details-item__title, [class*="details-item__title"], h2',
  );
  if (labelEl) {
    const p = document.createElement('p');
    p.textContent = labelEl.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) introFrag.appendChild(p);
  }
  if (titleEl) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    if (h2.textContent) introFrag.appendChild(h2);
  }

  element.replaceWith(introFrag, block);
}
