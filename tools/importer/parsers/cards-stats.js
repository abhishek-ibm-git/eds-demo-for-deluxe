/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats (REUSED existing block).
 * Base block: cards
 * Source URL: https://www.deluxe.com/ (Statistics Slider — "Why Deluxe?")
 * Generated: 2026-06-18.
 *
 * Model (blocks/cards-stats/_cards-stats.json): container block "cards-stats" with child "card".
 *   card.image -> reference (no images in this source, image cell left empty)
 *   card.text  -> richtext (large stat number + sub-title heading + description)
 *
 * Source DOM: each stat card is `.swiper-slide.slide-main-content` inside `.mySwiper2`:
 *   <h2>$2T+</h2>
 *   <div class="sub-title">
 *     <span class="sub-title__heading">In Payments Processed</span>
 *     <p class="sub-desc">On average, Deluxe processes ...</p>
 *   </div>
 * The thumbnail swiper (.mySwiper / .slide-content) duplicates this content and is intentionally ignored.
 */
export default function parse(element, { document }) {
  // Use only the main content slides; ignore the thumbnail .mySwiper slides (duplicate data).
  let slides = Array.from(
    element.querySelectorAll('.mySwiper2 .swiper-slide.slide-main-content'),
  );
  // Fallback for DOM variations where the main swiper class differs.
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.swiper-slide.slide-main-content'));
  }

  const cells = [];

  slides.forEach((slide) => {
    // Large stat number (e.g. "$2T+").
    const number = slide.querySelector(':scope > h2, :scope > h1, :scope > h3');
    // Sub-title heading (e.g. "In Payments Processed").
    const subHeading = slide.querySelector('.sub-title__heading, .sub-title > span');
    // Description paragraph.
    const desc = slide.querySelector('.sub-desc, .sub-title p, .sub-title > p');

    // Skip empty slides.
    if (!number && !subHeading && !desc) return;

    // Build the richtext content for the text field.
    const textContent = [];
    if (number) {
      const numHeading = document.createElement('h2');
      numHeading.textContent = number.textContent.trim();
      textContent.push(numHeading);
    }
    if (subHeading) {
      const subTitle = document.createElement('h3');
      subTitle.textContent = subHeading.textContent.trim();
      textContent.push(subTitle);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.replace(/\s+/g, ' ').trim();
      textContent.push(p);
    }

    // Image cell (empty — no image in this variant; reference field, no hint per hinting Rule 4).
    const imageCell = document.createElement('div');

    // Text cell with field hint.
    const textCell = document.createElement('div');
    textCell.appendChild(document.createComment(' field:text '));
    textContent.forEach((node) => textCell.appendChild(node));

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard: bail gracefully if no cards were extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
