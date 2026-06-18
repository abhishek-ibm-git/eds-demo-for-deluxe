/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news (base block: cards).
 * Source: https://www.deluxe.com/ (News & Trusted Insights / Featured Resources)
 * Generated for xwalk project (field hints: image, text).
 *
 * Container block: each card = one row, two columns:
 *   - cell 1 (field:image): hero/thumbnail image (omitted for link-only cards)
 *   - cell 2 (field:text):  richtext — heading + description + a clean text link
 *
 * The richtext `text` field must contain only text-level markup (headings,
 * paragraphs, anchors). Decorative sprite <img>/<picture> icons from the source
 * (arrow glyphs, chevrons) are stripped — leaving them inside the richtext cell
 * is what breaks the card model column mapping.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Build a clean text cell (field:text) from a title, description, and link.
  const buildTextCell = (titleEl, descEl, linkEl) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));

    if (titleEl) {
      const tag = /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : 'h3';
      const h = document.createElement(tag);
      h.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
      if (h.textContent) frag.appendChild(h);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) frag.appendChild(p);
    }
    if (linkEl) {
      const href = linkEl.getAttribute('href');
      const text = linkEl.textContent.replace(/\s+/g, ' ').trim();
      // Only keep links that have a readable label (skip icon-only anchors).
      if (href && text) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        p.appendChild(a);
        frag.appendChild(p);
      }
    }
    return frag;
  };

  // Build an image cell (field:image). The hint is always present so the image
  // field aligns to a column; the <img> is appended only when one exists.
  const buildImageCell = (img) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    if (img) frag.appendChild(img);
    return frag;
  };

  const hasText = (frag) => frag.querySelector('h1,h2,h3,h4,h5,h6,p,a') !== null;

  // 1. Featured blog card (image + H3 title + description + CTA).
  const featured = element.querySelector('.news-and-update-gen3-v1__contents-body');
  if (featured) {
    const fImg = featured.querySelector('.news-and-update-gen3-v1__contents-body__image img, img');
    const fTitle = featured.querySelector('.news-and-update-gen3-v1__contents-body__title, h3');
    const fDesc = featured.querySelector('.news-and-update-gen3-v1__contents-body__description, p');
    const fLink = featured.querySelector('.news-and-update-gen3-v1__contents-body__buttons a, a.rd-deluxe-button-primary-red-long');
    const text = buildTextCell(fTitle, fDesc, fLink);
    if (hasText(text)) cells.push([buildImageCell(fImg), text]);
  }

  // 2. Secondary blog list items (thumbnail + H5 title + description + link).
  element.querySelectorAll('.news-and-update-gen3-v1__contents-list__item__row').forEach((item) => {
    const iImg = item.querySelector('.news-and-update-gen3-v1__contents-list__item__image img, img');
    const iTitle = item.querySelector('.news-and-update-gen3-v1__contents-list__item__details__title, h5');
    const iDesc = item.querySelector('.news-and-update-gen3-v1__contents-list__item__details__description, p');
    const iLink = item.querySelector('.news-and-update-gen3-v1__contents-list__item__details__link a, a[aria-label]');
    const text = buildTextCell(iTitle, iDesc, iLink);
    if (hasText(text)) cells.push([buildImageCell(iImg), text]);
  });

  // 3. "More Resources And News" link pairs (headline + description + link, no image).
  element.querySelectorAll('.news-and-update-gen3-v1__contents__resources-news__item-wrapper').forEach((wrapper) => {
    const rLink = wrapper.querySelector(':scope > a, a');
    const rHeadline = wrapper.querySelector('.news-and-update-gen3-v1__contents__resources-news__item__headline');
    const rDesc = wrapper.querySelector('.news-and-update-gen3-v1__contents__resources-news__item__description');
    const text = buildTextCell(rHeadline, rDesc, rLink);
    if (hasText(text)) cells.push([buildImageCell(null), text]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
