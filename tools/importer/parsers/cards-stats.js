/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats
 * Base block: cards (container block)
 * Source: https://sei-demo-nextjs.vercel.app/
 * Selector: section.by-numbers .by-numbers-grid
 * Generated: 2026-05-13
 *
 * Source structure: .by-numbers-grid containing multiple .by-numbers-stat items,
 * each with .by-numbers-val, .by-numbers-label, and .by-numbers-short children.
 *
 * Target: Cards container block - each stat becomes a row with [image, text] columns.
 * Stats have no image so image cell is empty; text cell contains the stat value,
 * label, and short description as richtext.
 */
export default function parse(element, { document }) {
  // Extract all stat card items from source
  const statItems = element.querySelectorAll(':scope > .by-numbers-stat');

  const cells = [];

  statItems.forEach((stat) => {
    const val = stat.querySelector('.by-numbers-val');
    const label = stat.querySelector('.by-numbers-label');
    const shortLabel = stat.querySelector('.by-numbers-short');

    // Build text cell content with field hint
    // Container block: each row = one child item, columns = [image, text]
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Create structured content: value as heading, label as paragraph, short as paragraph
    if (val) {
      const heading = document.createElement('h4');
      heading.textContent = val.textContent.trim();
      textFrag.appendChild(heading);
    }
    if (label) {
      const p = document.createElement('p');
      p.textContent = label.textContent.trim();
      textFrag.appendChild(p);
    }
    if (shortLabel) {
      const p = document.createElement('p');
      p.textContent = shortLabel.textContent.trim();
      textFrag.appendChild(p);
    }

    // Image cell is empty (no images in stats cards)
    // Per hinting rules: empty cells do NOT require HTML comments
    const imageCell = '';

    // Each row: [image, text] per container block model
    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
