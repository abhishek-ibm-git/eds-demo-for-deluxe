/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: deluxe.com section breaks and section metadata.
 *
 * The homepage template defines 7 sections (see page-templates.json). This
 * transformer inserts a section break (<hr>) before every non-first section
 * and a "Section Metadata" block for each section that carries a `style`.
 *
 * Sections (selectors validated against migration-work/cleaned.html):
 *   rc1 div.featuredproductsherogen3v1   style: null
 *   rc2 div.homestorybannergen3v1        style: null
 *   rc3 div.solutionslidegen3v2          style: null
 *   rc4 div.statisticslidergen3v1        style: stats-blue
 *   rc5 div.flashcardsvariation2gen3v1   style: null
 *   rc6 div.newsandupdatesgen3v1         style: null
 *   rc7 div.postctagen3v1                style: cta-red
 *
 * Runs in beforeTransform: the original AEM component div for each section
 * still exists at this point. Block parsers later replace those component
 * divs (via replaceWith) with EDS block elements, but the <hr> and
 * Section Metadata nodes inserted here are siblings of the component div, so
 * they survive the replacement and keep the section boundaries intact.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Deluxe promo ribbon: a thin blue announcement bar at the very top of the
  // page. It lives in the global site shell (removed by deluxe-cleanup), so it
  // is reconstructed here as the first authorable section with a promo-ribbon
  // section style. Inserted before everything else, followed by an <hr>.
  const promoPara = doc.createElement('p');
  promoPara.append(doc.createTextNode('Free Shipping & Handling on Business Check Orders*'));
  const promoLink = doc.createElement('a');
  promoLink.setAttribute('href', 'https://www.deluxe.com/shopdeluxe/cl/business-checks-banking-products/business-checks/_/N-wha0kw');
  promoLink.textContent = 'LEARN MORE';
  promoPara.append(' ', promoLink);

  const promoMeta = WebImporter.Blocks.createBlock(doc, {
    name: 'Section Metadata',
    cells: { style: 'promo-ribbon' },
  });

  element.prepend(doc.createElement('hr'));
  element.prepend(promoMeta);
  element.prepend(promoPara);

  // Process in reverse so inserted nodes don't shift the positions of
  // sections we haven't handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section || !section.selector) continue;

    // Resolve the section's first element from its template selector.
    const sectionEl = element.querySelector(section.selector);
    if (!sectionEl) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metaBlock);
    }

    // Section break before every non-first section.
    if (i > 0) {
      sectionEl.before(doc.createElement('hr'));
    }
  }
}
