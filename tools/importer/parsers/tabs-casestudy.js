/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-casestudy
 * Base block: tabs
 *
 * UE Model fields (tabs-casestudy-item):
 *   - title (text) -> col 1
 *   - content_heading, content_headingType, content_image, content_richtext -> col 2 (grouped by content_ prefix)
 */
export default function parse(element, { document }) {
  const parentSection = element.closest('section') || element.parentElement;

  if (element.classList.contains('trusted-panel')) {
    const empty = document.createTextNode('');
    element.replaceWith(empty);
    return;
  }

  const tabsContainer = element;
  const panelContainer = parentSection.querySelector('.trusted-panel');
  const tabButtons = Array.from(tabsContainer.querySelectorAll('button.trusted-tab'));
  const panelInner = panelContainer
    ? panelContainer.querySelector('.trusted-panel-inner')
    : null;

  const activeIndex = tabButtons.findIndex((tab) => tab.classList.contains('trusted-tab--active'));
  const activePanelIndex = activeIndex >= 0 ? activeIndex : 0;

  const cells = [];

  tabButtons.forEach((tab, index) => {
    const tabImg = tab.querySelector('img.trusted-tab-img');
    const tabTitle = tabImg ? tabImg.getAttribute('alt') || '' : '';

    // Col 1: title
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:title '));
    const titleP = document.createElement('p');
    titleP.textContent = tabTitle;
    titleCell.appendChild(titleP);

    // Col 2: all content_ fields in model order: content_heading, content_image, content_richtext
    const contentCell = document.createDocumentFragment();

    if (index === activePanelIndex && panelInner) {
      // content_heading: panel headline as h3 (must come first per model order)
      const headline = panelInner.querySelector('h3.trusted-panel-headline, h3, h2');
      if (headline) {
        contentCell.appendChild(document.createComment(' field:content_heading '));
        const h3 = document.createElement('h3');
        h3.textContent = headline.textContent.trim();
        contentCell.appendChild(h3);
      }
    }

    // content_image: tab logo (second per model order)
    if (tabImg) {
      contentCell.appendChild(document.createComment(' field:content_image '));
      const imgP = document.createElement('p');
      const imgClone = tabImg.cloneNode(true);
      imgP.appendChild(imgClone);
      contentCell.appendChild(imgP);
    }

    if (index === activePanelIndex && panelInner) {
      // content_richtext: tag, body, CTA, stats (third per model order)
      const tag = panelInner.querySelector('.trusted-card-tag');
      const body = panelInner.querySelector('p.trusted-card-body, .trusted-card-body');
      const cta = panelInner.querySelector('a.trusted-cta, a');
      const stats = panelInner.querySelectorAll('.trusted-stat');

      const hasRich = tag || body || cta || stats.length > 0;
      if (hasRich) {
        contentCell.appendChild(document.createComment(' field:content_richtext '));

        if (tag) {
          const tagP = document.createElement('p');
          tagP.textContent = tag.textContent.trim();
          contentCell.appendChild(tagP);
        }

        if (body) {
          contentCell.appendChild(body.cloneNode(true));
        }

        if (cta) {
          const ctaClone = cta.cloneNode(true);
          ctaClone.querySelectorAll('img[src^="data:"]').forEach((svg) => svg.remove());
          const ctaP = document.createElement('p');
          ctaP.appendChild(ctaClone);
          contentCell.appendChild(ctaP);
        }

        stats.forEach((stat) => {
          const val = stat.querySelector('.trusted-stat-val');
          const label = stat.querySelector('.trusted-stat-label');
          if (val || label) {
            const statP = document.createElement('p');
            if (val) {
              const strong = document.createElement('strong');
              strong.textContent = val.textContent.trim();
              statP.appendChild(strong);
            }
            if (label) {
              statP.appendChild(document.createTextNode(' ' + label.textContent.trim()));
            }
            contentCell.appendChild(statP);
          }
        });
      }
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-casestudy', cells });
  element.replaceWith(block);
}
