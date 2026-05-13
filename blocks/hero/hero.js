export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];
  // Model: 2 effective columns [image (with alt attr), text]
  // imageAlt field collapses into image cell via xwalk field collapsing
  const [imageCol] = cols;

  // Unwrap image from any <p> wrapper for proper CSS positioning
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) {
      const pTag = img.closest('p');
      if (pTag && pTag.parentElement) {
        pTag.parentElement.replaceChild(img, pTag);
      }
    }
  }
}
