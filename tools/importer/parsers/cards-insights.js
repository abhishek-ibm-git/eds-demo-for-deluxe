/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-insights
 * Base block: cards (container block)
 * Source: https://sei-demo-nextjs.vercel.app/
 * Selector: section.insights-bd .insights-bd-grid
 * Generated: 2026-05-13
 *
 * UE Model fields per card item:
 *   - image (reference): Card image
 *   - text (richtext): Card body text (category, headline, excerpt, person info, badge)
 *
 * Source structure per card:
 *   .insight-bd-card
 *     .insight-bd-image > img (person photo)
 *     .insight-bd-badge (type icon + label like "Podcast" / "Article")
 *     .insight-bd-person > .insight-bd-name + .insight-bd-role
 *     .insight-bd-body > .insight-bd-category + .insight-bd-headline + .insight-bd-excerpt
 */
export default function parse(element, { document }) {
  // Extract all cards from the grid
  const cards = element.querySelectorAll('.insight-bd-card');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Image with field hint
    const img = card.querySelector('.insight-bd-image > img');
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Column 2: Text content with field hint
    // Combine badge type, person info, category, headline, and excerpt into richtext
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Badge label (e.g., "Podcast", "Article")
    const badgeLabel = card.querySelector('.insight-bd-badge');
    if (badgeLabel) {
      // Extract only the text node from badge (not the icon img)
      const badgeText = badgeLabel.childNodes;
      let labelText = '';
      badgeText.forEach((node) => {
        if (node.nodeType === 3) { // text node
          labelText += node.textContent.trim();
        }
      });
      if (labelText) {
        const badgeEl = document.createElement('p');
        badgeEl.textContent = labelText;
        textCell.appendChild(badgeEl);
      }
    }

    // Person name and role
    const personName = card.querySelector('.insight-bd-name');
    const personRole = card.querySelector('.insight-bd-role');
    if (personName) {
      const nameEl = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = personName.textContent.trim();
      nameEl.appendChild(strong);
      if (personRole) {
        nameEl.appendChild(document.createElement('br'));
        nameEl.appendChild(document.createTextNode(personRole.textContent.trim()));
      }
      textCell.appendChild(nameEl);
    }

    // Category
    const category = card.querySelector('.insight-bd-category');
    if (category) {
      const catEl = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = category.textContent.trim();
      catEl.appendChild(em);
      textCell.appendChild(catEl);
    }

    // Headline
    const headline = card.querySelector('.insight-bd-headline');
    if (headline) {
      const headingEl = document.createElement('h4');
      headingEl.textContent = headline.textContent.trim();
      textCell.appendChild(headingEl);
    }

    // Excerpt
    const excerpt = card.querySelector('.insight-bd-excerpt');
    if (excerpt) {
      const excerptEl = document.createElement('p');
      excerptEl.textContent = excerpt.textContent.trim();
      textCell.appendChild(excerptEl);
    }

    // Each card is a row with [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insights', cells });
  element.replaceWith(block);
}
