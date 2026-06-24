/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-services. Base block: cards.
 * Source: https://www.deluxe.com/ (Proven Success flash cards — "Flashing Cards Variation-2")
 * Generated: 2026-06-18
 *
 * Container block (cards). Each card = one row with two cells:
 *   - cell 1 (field:image): card icon/image
 *   - cell 2 (field:text):  H3 title + body description
 *
 * Source structure: each card is a `.swiper-slide.flashing-cards-variation-2__item`
 * containing an `.flashing-cards-variation-2__icon-container` (SVG icons) and a
 * `.flashing-cards-variation-2__content` (h3 title + p bodycopy).
 */
export default function parse(element, { document }) {
  // Supports both "Flashing Cards Variation-2" (homepage: .flashing-cards-variation-2__*)
  // and "Flashing Cards Variation-1" (about page: .flashing-cards__*) markup.
  // Each card is a swiper slide. Fall back to the inner content blocks if slide markup varies.
  let cards = Array.from(
    element.querySelectorAll('.swiper-slide.flashing-cards-variation-2__item, .swiper-slide.flashing-cards__item'),
  );
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll('.flashing-cards-variation-2__item, .flashing-cards__item'));
  }
  if (!cards.length) {
    // Last-resort fallback: derive cards from the content blocks themselves.
    cards = Array.from(element.querySelectorAll('.flashing-cards-variation-2__content, .flashing-cards__content'))
      .map((c) => c.closest('.swiper-slide, .flashing-cards-variation-2__item, .flashing-cards__item') || c);
  }

  const cells = [];

  cards.forEach((card) => {
    // --- Image / icon cell ---
    // The icon container holds inline SVGs (icon-normal / icon-active). Prefer a real
    // image asset if present, otherwise capture the icon SVG markup.
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    const img = card.querySelector('img');
    const svg = card.querySelector('.flashing-cards-variation-2__icon-container svg, .flashing-cards__icon-container svg, .icon-active svg, .icon-normal svg');
    const iconSpan = card.querySelector('.flashing-cards-variation-2__icon-container .inline-svg-icon, .flashing-cards__icon-container .inline-svg-icon, .inline-svg-icon');
    if (img) {
      imageFrag.appendChild(img);
    } else if (svg) {
      imageFrag.appendChild(svg);
    } else if (iconSpan) {
      imageFrag.appendChild(iconSpan);
    }

    // --- Text cell (title + description) ---
    const content = card.querySelector('.flashing-cards-variation-2__content, .flashing-cards__content') || card;
    const title = content.querySelector('h3, .flashing-cards-variation-2__title, .flashing-cards__title, [class*="title"]');
    // Prefer the dedicated bodycopy element; fall back to a paragraph that is
    // NOT nested inside the title (titles may wrap their text in <p>).
    let description = content.querySelector('.flashing-cards-variation-2__bodycopy, .flashing-cards__bodycopy, [class*="bodycopy"]');
    if (!description) {
      description = Array.from(content.querySelectorAll('p')).find((p) => !title || !title.contains(p));
    }

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (title) textFrag.appendChild(title);
    if (description) textFrag.appendChild(description);

    // Skip cards that have no usable content.
    if (!title && !description && !img && !svg) return;

    cells.push([imageFrag, textFrag]);
  });

  // Empty-block guard: nothing extracted, unwrap the element.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-services', cells });

  // Section intro (eyebrow + title + description) rendered as default content
  // above the block, matching the source "Proven Success" header.
  const introFrag = document.createDocumentFragment();
  const eyebrowEl = element.querySelector(
    '.flashing-cards-variation-2__label, [class*="__label"]',
  );
  const titleEl = element.querySelector(
    '.flashing-cards-variation-2__page-title, [class*="page-title"], h2',
  );
  const descEl = element.querySelector(
    '.flashing-cards-variation-2__page-description, [class*="page-description"]',
  );
  if (eyebrowEl) {
    const p = document.createElement('p');
    p.textContent = eyebrowEl.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) introFrag.appendChild(p);
  }
  if (titleEl) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    if (h2.textContent) introFrag.appendChild(h2);
  }
  if (descEl) {
    const p = document.createElement('p');
    p.textContent = descEl.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) introFrag.appendChild(p);
  }

  element.replaceWith(introFrag, block);
}
