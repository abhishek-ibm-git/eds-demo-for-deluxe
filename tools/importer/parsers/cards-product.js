/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product (base block: cards). [validation retry]
 * Source: https://www.deluxe.com/ — "Featured Products Hero" cards.
 * Generated for xwalk project (field hints: image, text).
 *
 * Container block: each card = one row, two columns:
 *   - cell 1: image  (icon/SVG image — usually absent on this source, left empty)
 *   - cell 2: text   (richtext: product/solution label + link(s))
 *
 * Source variations handled:
 *   - Single-link cards: wrapper is an <a class="...__card-wrapper" href="...">; the
 *     card label becomes the link text, linked to the wrapper href.
 *   - Multi-link cards ("additional"): wrapper is a <div>; label is plain text and the
 *     real links live in .__card__additional-links > a. Decorative external-link-icon
 *     <img> sprites inside link text are removed.
 */
export default function parse(element, { document }) {
  const cardsContainer = element.querySelector(
    '.featured-products-hero-gen3v1__content__cards, [class*="content__cards"]',
  );
  const scope = cardsContainer || element;

  // Each card is a wrapper (either an <a> or a <div>).
  const wrappers = Array.from(
    scope.querySelectorAll(
      '.featured-products-hero-gen3v1__content__cards__card-wrapper, [class*="cards__card-wrapper"]',
    ),
  );

  const cells = [];

  wrappers.forEach((wrapper) => {
    // The card element holds both the content (icon + label) and, for multi-link
    // cards, a sibling additional-links container.
    const card = wrapper.querySelector(
      '.featured-products-hero-gen3v1__content__cards__card, [class*="cards__card"]',
    ) || wrapper;
    const content = card.querySelector(
      '.featured-products-hero-gen3v1__content__cards__card__content, [class*="card__content"]',
    ) || card;

    // --- Image cell (icon) ---
    // Real icon assets rarely survive (inline SVGs are stripped). Pick a genuine
    // image/svg if present, excluding decorative external-link sprite icons.
    const iconImg = content.querySelector(
      'img:not(.external-link-icon):not([class*="external-link"]), svg:not([class*="external-link"])',
    );

    // --- Text cell (label + links) ---
    const labelEl = content.querySelector(
      '.featured-products-hero-gen3v1__content__cards__card__label, [class*="card__label"]',
    );
    const labelText = labelEl ? labelEl.textContent.trim() : '';

    const textCell = [];

    // Collect explicit additional links (multi-link cards). These live in a
    // container that is a sibling of __content within the card element.
    const additionalLinks = Array.from(
      card.querySelectorAll(
        '.featured-products-hero-gen3v1__content__cards__card__additional-links a, [class*="additional-links"] a',
      ),
    );

    if (additionalLinks.length > 0) {
      // Label is a heading, then each cleaned link.
      if (labelText) {
        const heading = document.createElement('h3');
        heading.textContent = labelText;
        textCell.push(heading);
      }
      additionalLinks.forEach((a) => {
        // Strip decorative icons / extra markup, keep clean anchor text + href.
        const clean = document.createElement('a');
        clean.href = a.getAttribute('href') || '';
        if (a.getAttribute('title')) clean.title = a.getAttribute('title');
        clean.textContent = a.textContent.replace(/\s+/g, ' ').trim();
        textCell.push(clean);
      });
    } else {
      // Single-link card: wrapper href drives the link; label is the link text.
      const href =
        wrapper.tagName === 'A'
          ? wrapper.getAttribute('href')
          : (wrapper.querySelector('a') && wrapper.querySelector('a').getAttribute('href'));
      if (href && labelText) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = labelText;
        textCell.push(link);
      } else if (labelText) {
        const heading = document.createElement('h3');
        heading.textContent = labelText;
        textCell.push(heading);
      }
    }

    // Skip cards with no usable content.
    if (!iconImg && textCell.length === 0) return;

    // --- xwalk field hints ---
    // Image cell (field:image) — only emit a hint when an image actually exists.
    let imageCellContent = '';
    if (iconImg) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      imgFrag.appendChild(iconImg);
      imageCellContent = imgFrag;
    }

    // Text cell (field:text).
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textCell.forEach((node) => textFrag.appendChild(node));

    cells.push([imageCellContent, textFrag]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
