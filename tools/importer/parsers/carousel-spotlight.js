/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-spotlight
 * Base block: carousel
 * Source: https://sei-demo-nextjs.vercel.app/
 * Generated: 2026-05-13
 *
 * Extracts spotlight carousel cards from source HTML and maps them
 * into a carousel-spotlight block table. Each card becomes a row
 * with two columns: [image] [text content].
 *
 * Model fields per row (container block):
 *   - media_image (+ media_imageAlt collapsed into img alt)
 *   - content_text (richtext label)
 */
export default function parse(element, { document }) {
  // Select all spotlight cards from the carousel track
  const cards = element.querySelectorAll('.spotlight-card');

  const cells = [];

  cards.forEach((card) => {
    // Extract image - the main card thumbnail/background
    const img = card.querySelector('img.spotlight-card-img');

    // Extract text label
    const label = card.querySelector('span.spotlight-card-label');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', img.getAttribute('src'));
      imgEl.setAttribute('alt', img.getAttribute('alt') || '');
      picture.appendChild(imgEl);
      imageCell.appendChild(picture);
    }

    // Build content cell with field hint
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));
    if (label) {
      const p = document.createElement('p');
      p.textContent = label.textContent.trim();
      contentCell.appendChild(p);
    }

    // Each card is a row with two columns: [image, content]
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-spotlight', cells });
  element.replaceWith(block);
}
