/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: deluxe.com Dynamic Media / Scene7 image handling.
 *
 * Converts Scene7 `<img src="https://deluxe.scene7.com/is/image/...">` tags
 * into anchors that round-trip through markdown intact, so the EDS client-side
 * auto-block (buildDynamicMediaImages in scripts/scripts.js) can rebuild them
 * as responsive <picture> elements at load time.
 *
 * Why this is needed for the about-page: the "Get To Know Us" product-listing
 * card grid (div.product-listing, section rc7) uses Scene7 DM URLs for its 4
 * tile images. Verified via migration-work/metadata.json .images.mapping:
 *   ./images/5b7cf985735b.jpg <= .../is/image/deluxecorp/elt-group-shot-2025...
 *   ./images/187a687b358c.jpg <= .../is/image/deluxecorp/about-us-deluxe-culture...
 *   ./images/061bdc305f82.jpg <= .../is/image/deluxecorp/about-us-parent-page-our-history...
 *   ./images/e7b8cd6c753c.jpg <= .../is/image/deluxecorp/about-us-deluxe-locations...
 * (cleaned.html shows local hashed src; the originals survive only in the
 * mapping, which is why detection runs against metadata.json, not the HTML.)
 *
 * Template-agnostic: the transformer walks every <img> under the parsed DOM and
 * only rewrites those whose src matches a DM/Scene7 URL (detectDynamicMediaUrl).
 * Non-DM images — including the homepage's local images and the about-page's
 * non-Scene7 hero/video/infographic/award images — are left untouched, so this
 * is a safe, additive transformer that does not regress the homepage.
 *
 * Runs in afterTransform ONLY: block parsers run between beforeTransform and
 * afterTransform and extract <img> references into block cells (e.g. the
 * cards-tiles image cells). Rewriting imgs to anchors in beforeTransform would
 * leave parsers with no <img> and produce empty cells.
 *
 * Canonical helpers below are copied verbatim from
 * sub-agents/.../references/dm-scene7-helpers.js and MUST stay byte-identical
 * with the auto-block's inlined copy in scripts/scripts.js. Do not re-derive
 * the detection regex or wrapper-walk logic.
 */

// ---- Begin canonical helpers (copy from dm-scene7-helpers.js) ----
function detectDynamicMediaUrl(urlStr) {
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch { return false; }
  // Scene7 detected by path alone — hostname is irrelevant because
  // customer sites routinely CNAME a vanity domain to Scene7 (e.g.
  // media-assets.brand.example). Keep byte-identical with dm-scene7-helpers.js.
  if (u.pathname.startsWith('/is/image/')) {
    return 'scene7';
  }
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
      && u.pathname.startsWith('/adobe/assets/urn:')) {
    return 'dm-openapi';
  }
  return false;
}

// Walk up from a DM <img> through allow-listed inline wrappers (currently
// just <picture>) to find the carrier anchor for the linked-image
// round-trip. Returns the outer <a> when the img is the sole meaningful
// descendant; null otherwise. Without the walk, parsers that pre-wrap
// the img in <picture> — e.g. cards-portfolio on 2026-05-13 producing
// <a href="/page"><picture><img src=DM></picture></a> — slip past the
// linked branch and end up nested-anchored, splitting into two siblings
// in markdown. Keep byte-identical with dm-scene7-helpers.js.
const LINKED_DM_INLINE_WRAPPER_TAGS = new Set(['PICTURE']);
const LINKED_DM_WRAPPER_SIBLING_TAGS = new Set(['SOURCE']); // standard <picture> siblings
function findLinkedDmCarrier(img) {
  if (!img || !img.parentElement) return null;
  let node = img;
  let parent = img.parentElement;
  while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
    let foundNode = false;
    for (const child of parent.children) {
      if (child === node) {
        foundNode = true;
      } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
        return null;
      }
    }
    if (!foundNode) return null;
    node = parent;
    parent = parent.parentElement;
  }
  if (!parent || parent.tagName !== 'A') return null;
  if (parent.children.length !== 1 || parent.children[0] !== node) return null;
  if (parent.textContent.trim() !== '') return null;
  return parent;
}

const EMPTY_ALT_SENTINEL = 'Image without alt text';

function altToLinkText(alt) {
  return alt || EMPTY_ALT_SENTINEL;
}
// ---- End canonical helpers ----

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;

  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!detectDynamicMediaUrl(src)) return;

    // Preserve alt verbatim, including empty string for decorative images.
    // The auto-block uses the URL pattern (not the text) to find these
    // anchors, so the link text is purely a Document-view UX cue. When alt
    // is empty we substitute EMPTY_ALT_SENTINEL ('Image without alt text')
    // so authors editing the doc see a visible cell at the image's
    // position; the auto-block translates the sentinel back to alt="" via
    // linkTextToAlt() so screen readers correctly skip decorative images.
    const alt = img.getAttribute('alt') || '';

    // Linked image (incl. parser-wrapped `<a><picture><img></picture></a>`).
    // Stash DM URL in title, keep outer href; setting textContent replaces
    // any wrapper descendants with the link text.
    const linkedAnchor = findLinkedDmCarrier(img);
    if (linkedAnchor) {
      linkedAnchor.setAttribute('title', src);
      linkedAnchor.textContent = altToLinkText(alt);
      return;
    }

    // Inside an anchor but not a sole-meaningful-child shape — mixed
    // content. No clean single-anchor markdown representation; skip.
    const parent = img.parentElement;
    if (parent && parent.tagName === 'A') {
      // eslint-disable-next-line no-console
      console.warn('DM image inside mixed-content anchor, skipped:', src);
      return;
    }

    // Unlinked image: create an anchor whose href is the DM URL.
    const a = doc.createElement('a');
    a.href = src;
    a.textContent = altToLinkText(alt);
    img.replaceWith(a);
  });
}
