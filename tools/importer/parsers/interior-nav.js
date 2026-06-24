/* eslint-disable */
/* global WebImporter */
/**
 * Parser for interior-nav. Base block: interior-nav (custom; not in block library).
 * Source: https://www.deluxe.com/about-us (div.interiornavigationgen3v1 — sticky anchor nav).
 * Generated for xwalk project.
 *
 * Container block. Filter `interior-nav` contains `interior-nav-link` children.
 * Child model fields:
 *   - link     (aem-content) — the in-page anchor target (#overview, ...)
 *   - linkText (text)        — COLLAPSED (ends in "Text") → rendered as the
 *                              anchor's text, never given its own field hint.
 * Each nav link = one row, one cell:
 *   <!-- field:link --><a href="#overview">Overview</a>
 *
 * Source structure: .interior-navigation__links > ul > li > a[data-href]
 * (each <li> is an in-page jump link; the target lives in data-href, label is
 * the anchor text). The first <li> carries an "active" class which we ignore.
 */
export default function parse(element, { document }) {
  // Anchor links live in the nav list; fall back to any anchor with a target.
  let links = Array.from(
    element.querySelectorAll('.interior-navigation__links ul li a, [class*="__links"] ul li a'),
  );
  if (!links.length) {
    links = Array.from(element.querySelectorAll('ul li a, nav a'));
  }

  const cells = [];

  links.forEach((a) => {
    // Anchor target: source stores the in-page target in data-href; fall back to href.
    const target = a.getAttribute('data-href') || a.getAttribute('href') || '';
    const label = a.textContent.replace(/\s+/g, ' ').trim();
    if (!target && !label) return;

    const anchor = document.createElement('a');
    anchor.href = target;
    anchor.textContent = label; // collapsed linkText → anchor text

    // One cell per link: field:link hint, then the anchor (collapsed linkText inside).
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:link '));
    frag.appendChild(anchor);

    cells.push([frag]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'interior-nav', cells });
  element.replaceWith(block);
}
