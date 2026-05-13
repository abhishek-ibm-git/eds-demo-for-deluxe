/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: SEI Demo section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json):
 *   section-1: section.hero (no style)
 *   section-2: section.spotlight (no style)
 *   section-3: section.know-sei (no style)
 *   section-4: section.trusted (style: "grey")
 *   section-5: section.by-numbers (no style)
 *   section-6: section.insights-bd (no style)
 *   section-7: section.stay-connected (style: "dark")
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Insert <hr> before every section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
