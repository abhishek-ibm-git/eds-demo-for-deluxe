export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: text content cell (eyebrow + heading + description + CTA)
  const contentRow = rows[0];
  if (contentRow) {
    const cell = contentRow.querySelector(':scope > div') || contentRow;
    cell.classList.add('story-banner-content');

    const h2 = cell.querySelector('h2');
    if (h2) {
      // eyebrow = first <p> before the heading
      const prev = h2.previousElementSibling;
      if (prev && prev.tagName === 'P') prev.classList.add('story-banner-eyebrow');
      // description = first <p> after heading that is not the CTA button
      const next = h2.nextElementSibling;
      if (next && next.tagName === 'P' && !next.classList.contains('button-container')) {
        next.classList.add('story-banner-description');
      }
    }
    if (cell !== contentRow) contentRow.replaceWith(cell);
  }

  // Row 2: media cell — convert the video link into an autoplaying looped video
  const mediaRow = rows[1];
  if (mediaRow) {
    const media = document.createElement('div');
    media.className = 'story-banner-media';

    const link = mediaRow.querySelector('a');
    if (link) {
      const src = link.getAttribute('href');
      const video = document.createElement('video');
      video.src = src;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      video.className = 'story-banner-video';
      media.append(video);
    } else {
      // fall back to whatever media (img/picture) is in the cell
      const cell = mediaRow.querySelector(':scope > div');
      if (cell) while (cell.firstChild) media.append(cell.firstChild);
    }
    mediaRow.replaceWith(media);
  }
}
