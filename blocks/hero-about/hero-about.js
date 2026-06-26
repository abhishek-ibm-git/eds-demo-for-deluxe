// Decorative side graphic from the source design (CSS-background on the original site,
// so it never lands in authored content — injected here to match the original layout).
const SIDE_IMAGE_URL = 'https://www.deluxe.com/content/dam/deluxe/us/en/site-global/redesign/images/hero-sidebyside-image-left.svg';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];

  // Identify an authored image column (a cell whose content is an image).
  const imageCol = cols.find((col) => col.querySelector('img'));

  // Determine the decorative image source: an authored image if present,
  // otherwise the original site's side graphic.
  let imageSrc = SIDE_IMAGE_URL;
  if (imageCol) {
    const authored = imageCol.querySelector('img');
    if (authored && authored.src) imageSrc = authored.src;
    // The authored image cell is not used directly — remove it so the content
    // column is the only authored cell; decorative images are injected below.
    imageCol.remove();
  }

  const contentCol = row.querySelector(':scope > div');
  if (contentCol) contentCol.classList.add('hero-about-content');

  // --- NEW LOGIC TO MOVE THE TEXT ---
  const secondRow = row.nextElementSibling;
  if (secondRow && contentCol) {
    // Take all children from the second row and move them into contentCol
    while (secondRow.firstElementChild) {
      contentCol.append(secondRow.firstElementChild);
    }
    // Remove the now-empty second row
    secondRow.remove();
  }

  const makeImage = (side) => {
    const div = document.createElement('div');
    div.className = `hero-about-image hero-about-image-${side}`;
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = '';
    img.loading = 'eager';
    div.append(img);
    return div;
  };

  // Decorative graphic on BOTH sides of the content, matching the original hero.
  row.insertBefore(makeImage('left'), row.firstElementChild);
  row.append(makeImage('right'));
}
