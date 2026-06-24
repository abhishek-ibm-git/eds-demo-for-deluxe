// Decorative side graphic from the source design (CSS-background on the original site,
// so it never lands in authored content — injected here to match the original layout).
const SIDE_IMAGE_URL = 'https://www.deluxe.com/content/dam/deluxe/us/en/site-global/redesign/images/hero-sidebyside-image-left.svg';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];

  // Identify an authored image column (a cell whose content is an image).
  const imageCol = cols.find((col) => col.querySelector('img'));

  if (imageCol) {
    // Unwrap image from any <p> wrapper for proper CSS positioning.
    const img = imageCol.querySelector('img');
    const pTag = img.closest('p');
    if (pTag && pTag.parentElement) {
      pTag.parentElement.replaceChild(img, pTag);
    }
    imageCol.classList.add('hero-about-image');
  } else {
    // No authored image: inject the decorative side graphic to preserve the
    // side-by-side layout of the original hero.
    const imageDiv = document.createElement('div');
    imageDiv.className = 'hero-about-image';
    const img = document.createElement('img');
    img.src = SIDE_IMAGE_URL;
    img.alt = '';
    img.loading = 'eager';
    imageDiv.append(img);
    row.insertBefore(imageDiv, row.firstElementChild);
  }
}
