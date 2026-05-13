/*
 * Accordion Pillars Block
 * Horizontal pillar grid with hover reveal animation
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-pillars-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-pillars-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-pillars-item';
    // Always keep open so body is rendered (reveal handled by CSS transform)
    details.setAttribute('open', '');
    details.append(summary, body);
    row.replaceWith(details);
  });

  // Prevent summary click from toggling open/closed
  block.querySelectorAll('.accordion-pillars-item-label').forEach((summary) => {
    summary.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}
