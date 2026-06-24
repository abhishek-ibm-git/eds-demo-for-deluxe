/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-infographic. Base block: columns.
 * Source: https://www.deluxe.com/about-us (div.mediasuitegen3v1 — infographic + text).
 * Generated for xwalk project.
 *
 * COLUMNS block (resourceType columns/v1/columns): 2 columns, 1 row.
 * Per the field-hinting rules, Columns blocks do NOT get field hints — cells
 * hold default content only.
 *   - row 1: block name
 *   - row 2: [ image cell , text cell ]
 *       image cell = the infographic <img>
 *       text cell  = small title ("Deluxe+") + H2 + 3 body paragraphs
 *
 * Source structure: .redesign-media-suite-gen3v1__container holds an
 * .image-container (> img infographic) and a .content-container with a
 * .title-section (.small-title span + h2.large-title) and a .list-options-item
 * holding the body paragraphs.
 */
export default function parse(element, { document }) {
  const container = element.querySelector(
    '.redesign-media-suite-gen3v1__container, [class*="__container"]',
  ) || element;

  // --- Image column (infographic) ---
  const imageCell = [];
  const imageContainer = container.querySelector('.image-container, [class*="image-container"]');
  const img = (imageContainer || container).querySelector('img');
  if (img) imageCell.push(img);

  // --- Text column ---
  const content = container.querySelector('.content-container, [class*="content-container"]')
    || container;
  const textCell = [];

  // Small title ("Deluxe+") — keep as an emphasised paragraph above the heading.
  const smallTitle = content.querySelector('.small-title, [class*="small-title"]');
  if (smallTitle) {
    const p = document.createElement('p');
    p.textContent = smallTitle.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) textCell.push(p);
  }

  // Main heading.
  const heading = content.querySelector('.large-title, h2, [class*="title"] h2, h2[class*="title"]');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    if (h2.textContent) textCell.push(h2);
  }

  // Body paragraphs.
  const body = content.querySelector('.list-options-item, [class*="list-options-item"]');
  if (body) {
    Array.from(body.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.replace(/\s+/g, ' ').trim()) textCell.push(p);
    });
  }

  // Empty-block guard.
  if (imageCell.length === 0 && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column, 1-row layout (Columns block — no field hints).
  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-infographic', cells });
  element.replaceWith(block);
}
