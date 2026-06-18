import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-stats -- Deluxe "Why Deluxe?" interactive stat orbit.
 * Each authored row = one stat (number h2, title h3, description p).
 * Renders a central detail panel plus 7 selector circles arranged in an arc.
 * The selected circle is filled black; its details show in the centre.
 * Default selection = first stat.
 */
export default function decorate(block) {
  // Parse each authored row into a stat object.
  const stats = [...block.children].map((row) => {
    const body = row.querySelector(':scope > div:last-child') || row;
    const number = body.querySelector('h2')?.textContent.trim() || '';
    const title = body.querySelector('h3')?.textContent.trim() || '';
    const desc = body.querySelector('p')?.textContent.trim() || '';
    return {
      number, title, desc, row,
    };
  }).filter((s) => s.number);

  block.textContent = '';

  // Centre detail panel.
  const detail = document.createElement('div');
  detail.className = 'cards-stats-detail';
  const detailNumber = document.createElement('span');
  detailNumber.className = 'cards-stats-detail-number';
  const detailTitle = document.createElement('span');
  detailTitle.className = 'cards-stats-detail-title';
  const detailDesc = document.createElement('p');
  detailDesc.className = 'cards-stats-detail-desc';
  detail.append(detailNumber, detailTitle, detailDesc);

  // Selector circles.
  const orbit = document.createElement('div');
  orbit.className = 'cards-stats-orbit';

  const circles = [];
  stats.forEach((stat, i) => {
    const circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'cards-stats-circle';
    circle.setAttribute('aria-label', `${stat.number} ${stat.title}`);
    circle.innerHTML = `<span class="cards-stats-circle-number">${stat.number}</span>`
      + `<span class="cards-stats-circle-title">${stat.title}</span>`;
    moveInstrumentation(stat.row, circle);

    const select = () => {
      circles.forEach((c) => c.setAttribute('aria-selected', 'false'));
      circle.setAttribute('aria-selected', 'true');
      detailNumber.textContent = stat.number;
      detailTitle.textContent = stat.title;
      detailDesc.textContent = stat.desc;
    };
    circle.addEventListener('click', select);
    circle.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    circles.push(circle);
    orbit.append(circle);
  });

  // Wrapper positions detail in the centre, circles around it.
  const stage = document.createElement('div');
  stage.className = 'cards-stats-stage';
  stage.append(orbit, detail);
  block.append(stage);

  // Initialise with the first stat selected.
  if (stats.length) {
    detailNumber.textContent = stats[0].number;
    detailTitle.textContent = stats[0].title;
    detailDesc.textContent = stats[0].desc;
  }
}
