import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  // NOTE: Do NOT call createOptimizedPicture here. The source authored these
  // <img> with absolute https://www.deluxe.com/... URLs that load directly.
  // The EDS optimized-picture pipeline rewrites them to a relative
  // /content/dam/...?optimize=medium path that 404s on this host, so we keep
  // the original src untouched.
  block.textContent = '';
  block.append(ul);
}
