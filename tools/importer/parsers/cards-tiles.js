/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tiles. Base block: cards.
 * Source: https://www.deluxe.com/about-us (div.product-listing — "Get To Know Us"
 * linked tile grid).
 * Generated for xwalk project (field hints: image, text).
 *
 * Container block (cards). Each tile = one row with two cells:
 *   - cell 1 (field:image): the tile image, kept inside its wrapping anchor
 *                            (linked-image carrier shape <a href="/page"><img></a>)
 *   - cell 2 (field:text):  H3 headline link + body paragraph
 *
 * Dynamic Media / Scene7: the tile images use deluxe.scene7.com/is/image/... URLs.
 * Per the xwalk DM requirements the parser does NOT special-case DM — it emits the
 * <img> in its natural slot (here inside the carrier anchor). The DM transformer
 * (transformers/deluxe-dm-images.js) rewrites the linked <a><img DM></a> into
 * <a href="/page" title="DM-URL">alt</a> in afterTransform so md2jcr stores it as
 * richtext, and the client-side auto-block rebuilds the responsive <picture>.
 * Preserving the wrapping anchor is what lets findLinkedDmCarrier() take the
 * linked-image branch — do not unwrap the img from its anchor.
 *
 * Source structure: .product-listing__tiles holds an <a> wrapping the
 * .product-listing__tiles-image-container (> img), an h3.product-listing__tiles__headline
 * (> a link), and a .product-listing__tiles__bodycopy (> p).
 * The section header (.product-listing__label eyebrow + h2 title) is emitted as
 * default content above the block, matching the cards-services/cards-product pattern.
 */
export default function parse(element, { document }) {
  let tiles = Array.from(
    element.querySelectorAll('.product-listing__tiles, [class*="__tiles-4-col"]'),
  );
  if (!tiles.length) {
    tiles = Array.from(element.querySelectorAll('[class*="__tiles"]'))
      .filter((t) => t.querySelector('img'));
  }

  const cells = [];

  tiles.forEach((tile) => {
    // --- Image cell (field:image) — keep the carrier anchor around the img ---
    const imgContainer = tile.querySelector(
      '.product-listing__tiles-image-container, [class*="image-container"]',
    );
    const img = (imgContainer || tile).querySelector('img');

    let imageCell = '';
    if (img) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));

      // The img is wrapped in an <a href="/about/..."> — preserve that linked-image
      // shape so the DM transformer's carrier-anchor branch picks it up.
      const wrapAnchor = img.closest('a');
      if (wrapAnchor) {
        const a = document.createElement('a');
        a.href = wrapAnchor.getAttribute('href') || '';
        a.appendChild(img);
        imgFrag.appendChild(a);
      } else {
        imgFrag.appendChild(img);
      }
      imageCell = imgFrag;
    }

    // --- Text cell (field:text): headline link + body paragraph ---
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const headlineEl = tile.querySelector(
      '.product-listing__tiles__headline, h3, [class*="__headline"]',
    );
    if (headlineEl) {
      const headlineLink = headlineEl.querySelector('a');
      const h3 = document.createElement('h3');
      if (headlineLink) {
        const a = document.createElement('a');
        a.href = headlineLink.getAttribute('href') || '';
        a.textContent = headlineLink.textContent.replace(/\s+/g, ' ').trim();
        h3.appendChild(a);
      } else {
        h3.textContent = headlineEl.textContent.replace(/\s+/g, ' ').trim();
      }
      if (h3.textContent) textFrag.appendChild(h3);
    }

    const bodyEl = tile.querySelector(
      '.product-listing__tiles__bodycopy, [class*="__bodycopy"]',
    );
    if (bodyEl) {
      Array.from(bodyEl.querySelectorAll('p')).forEach((p) => {
        if (p.textContent.replace(/\s+/g, ' ').trim()) textFrag.appendChild(p);
      });
    }

    // Skip tiles with no usable content.
    if (!img && textFrag.childNodes.length <= 1) return;

    cells.push([imageCell, textFrag]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells });

  // Section header (eyebrow + title) as default content above the block.
  const introFrag = document.createDocumentFragment();
  const labelEl = element.querySelector(
    '.product-listing__label, [class*="__label"]',
  );
  const titleEl = element.querySelector(
    '.product-listing__pagetitle, [class*="__pagetitle"], h2',
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
