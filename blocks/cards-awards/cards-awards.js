import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * Cards Awards variant — "Proven Success" zoom-card wall.
 * Compact square tiles show only the award badge image. On hover (or focus /
 * tap), the tile zooms larger and reveals its caption, matching the original
 * deluxe.com/about zoom-cards behaviour.
 */
export default function decorate(block) {
  const wall = document.createElement('ul');
  wall.className = 'cards-awards-wall';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-awards-item';
    li.tabIndex = 0;
    moveInstrumentation(row, li);

    let img = null;
    const caption = document.createElement('div');
    caption.className = 'cards-awards-caption';

    [...row.children].forEach((cell) => {
      const cellImg = cell.querySelector('img');
      if (cellImg) {
        img = cellImg;
      } else if (cell.textContent.trim()) {
        while (cell.firstChild) caption.append(cell.firstChild);
      }
    });

    const imageWrap = document.createElement('div');
    imageWrap.className = 'cards-awards-image';
    if (img) {
      const pic = img.closest('picture');
      imageWrap.append(pic || img);
    }

    li.append(imageWrap, caption);
    wall.append(li);
  });

  // Optimize images. createOptimizedPicture is path-only and would drop the
  // host of absolute external URLs (breaking them off-origin), so only optimize
  // same-origin / DAM images and leave external award badges untouched.
  wall.querySelectorAll('picture > img').forEach((img) => {
    let isExternal = false;
    try {
      isExternal = new URL(img.src, window.location.href).origin !== window.location.origin;
    } catch {
      isExternal = false;
    }
    if (isExternal) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hover / focus reveal: mark the active tile so CSS can zoom it.
  const setActive = (li) => {
    wall.querySelectorAll('.cards-awards-item.is-active').forEach((el) => {
      if (el !== li) el.classList.remove('is-active');
    });
    if (li) li.classList.add('is-active');
  };
  wall.querySelectorAll('.cards-awards-item').forEach((li) => {
    li.addEventListener('mouseenter', () => setActive(li));
    li.addEventListener('focus', () => setActive(li));
    li.addEventListener('click', () => {
      const active = li.classList.contains('is-active');
      setActive(active ? null : li);
    });
  });
  wall.addEventListener('mouseleave', () => setActive(null));

  block.textContent = '';
  block.append(wall);
}
