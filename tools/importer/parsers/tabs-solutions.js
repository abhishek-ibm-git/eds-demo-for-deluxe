/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-solutions.
 * Base block: tabs (container block; each tab = one tabs-item row).
 * Source: https://www.deluxe.com/ ("Solutions Slider" / div.solutionslidegen3v2)
 * Generated: 2026-06-18
 *
 * Structure (per library example + tabs-item UE model):
 *   - Each row = one tab.
 *   - Cell 1 (title): tab label  -> field:title
 *   - Cell 2 (content): heading + richtext list of solution items
 *       -> field:content_heading + field:content_richtext
 *
 * Extraction strategy: the desktop tab labels live in
 * `.solutions-slide-gen3-v2_slider-item` and the panels in
 * `.solutions-slide-gen3-v2_content-container`, but the mobile view
 * (`.solutions-slide-gen3-v2_mobile-view .swiper-slide`) pairs each tab label
 * with its full clean `<ul>` of solution items in a single element, so it is the
 * most reliable source for pairing labels with content. We fall back to the
 * desktop label/panel pairing if the mobile view is absent.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Helper: insert a field hint comment immediately before a content node.
  const withHint = (fieldName, node) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(node);
    return frag;
  };

  // Build the content cell (cell 2) for one tab from a list of solution-item
  // heading texts. First heading -> content_heading, remaining -> content_richtext.
  const buildContentCell = (itemTexts) => {
    const cell = [];
    const headings = itemTexts.filter((t) => t && t.trim());
    if (headings.length === 0) return cell;

    // content_heading: first solution item as the panel heading (h3 per UE template default)
    const headingEl = document.createElement('h3');
    headingEl.textContent = headings[0];
    cell.push(withHint('content_heading', headingEl));

    // content_richtext: remaining solution items as a list (preserves all content)
    if (headings.length > 1) {
      const ul = document.createElement('ul');
      headings.slice(1).forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      cell.push(withHint('content_richtext', ul));
    }
    return cell;
  };

  // --- Primary source: mobile view slides (label + clean item list) ---
  const mobileSlides = Array.from(
    element.querySelectorAll('.solutions-slide-gen3-v2_mobile-view .swiper-slide'),
  );

  if (mobileSlides.length) {
    mobileSlides.forEach((slide) => {
      const labelEl = slide.querySelector('.solutions-card h3, h3');
      const label = labelEl ? labelEl.textContent.replace(/\s+/g, ' ').trim() : '';

      const itemTexts = Array.from(
        slide.querySelectorAll('.solutions-card-content-lists > li h4, .solutions-card-content-lists > li'),
      )
        .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
        .filter((t) => t);

      if (!label && itemTexts.length === 0) return;

      // Cell 1: tab title
      const titleEl = document.createElement('p');
      titleEl.textContent = label;
      const titleCell = label ? [withHint('title', titleEl)] : [];

      // Cell 2: tab content
      const contentCell = buildContentCell(itemTexts);

      cells.push([titleCell, contentCell]);
    });
  } else {
    // --- Fallback: desktop labels + content panels paired by data-tab / id ---
    const tabItems = Array.from(
      element.querySelectorAll('.solutions-slide-gen3-v2_slider-item'),
    );
    const panels = Array.from(
      element.querySelectorAll('.solutions-slide-gen3-v2_content-container'),
    );

    tabItems.forEach((tabItem, index) => {
      const labelEl = tabItem.querySelector('.solutions-card h3, h3');
      const label = labelEl ? labelEl.textContent.replace(/\s+/g, ' ').trim() : '';

      // Match panel by data-tab attribute, else by index.
      const dataTab = tabItem.getAttribute('data-tab');
      let panel = dataTab
        ? element.querySelector(`#${CSS.escape(dataTab)}`)
        : null;
      if (!panel) panel = panels[index] || null;

      const itemTexts = panel
        ? Array.from(panel.querySelectorAll('.solutions-card-content h4, .solutions-card-content'))
            .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
            .filter((t) => t)
        : [];

      if (!label && itemTexts.length === 0) return;

      const titleEl = document.createElement('p');
      titleEl.textContent = label;
      const titleCell = label ? [withHint('title', titleEl)] : [];

      const contentCell = buildContentCell(itemTexts);

      cells.push([titleCell, contentCell]);
    });
  }

  // Empty-block guard: if no tabs were extracted, unwrap rather than emit an empty block.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-solutions', cells });
  element.replaceWith(block);
}
