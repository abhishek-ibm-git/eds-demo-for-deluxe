/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-pillars
 * Base block: accordion
 * Source: https://sei-demo-nextjs.vercel.app/
 * Selector: section.know-sei .know-sei-grid
 * Structure: Container block - each pillar item becomes one row with summary (col1) and text (col2)
 * UE Model: accordion-pillars-item (fields: summary, text)
 * Generated: 2026-05-13
 */
export default function parse(element, { document }) {
  // Extract all pillar items from the source grid
  const pillarItems = element.querySelectorAll('.know-pillar');

  const cells = [];

  pillarItems.forEach((pillar) => {
    // Extract summary/heading from pillar head
    const headEl = pillar.querySelector('.know-pillar-head');
    // Extract body text from pillar reveal
    const bodyEl = pillar.querySelector('.know-pillar-reveal .know-pillar-body, .know-pillar-reveal');

    // Build summary cell with field hint
    const summaryFrag = document.createDocumentFragment();
    summaryFrag.appendChild(document.createComment(' field:summary '));
    if (headEl) {
      summaryFrag.appendChild(headEl);
    }

    // Build text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (bodyEl) {
      textFrag.appendChild(bodyEl);
    }

    // Each item is a row with two columns: [summary, text]
    cells.push([summaryFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-pillars', cells });
  element.replaceWith(block);
}
