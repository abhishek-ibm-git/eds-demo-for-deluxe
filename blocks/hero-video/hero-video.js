export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: video cell - convert link to video element
  const videoRow = rows[0];
  if (videoRow) {
    const link = videoRow.querySelector('a');
    if (link) {
      const videoSrc = link.getAttribute('href');
      const video = document.createElement('video');
      video.src = videoSrc;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      video.className = 'hero-video-bg';
      // Replace the row content with the video
      videoRow.replaceWith(video);
    }
  }

  // Row 2: content cell - mark as content container
  const contentRow = rows[1];
  if (contentRow) {
    const cell = contentRow.querySelector(':scope > div');
    if (cell) {
      cell.className = 'hero-video-content';
      // Mark the eyebrow paragraph (first p before h1)
      const h1 = cell.querySelector('h1');
      if (h1 && h1.previousElementSibling && h1.previousElementSibling.tagName === 'P') {
        h1.previousElementSibling.className = 'hero-video-eyebrow';
      }
      // Mark the description paragraph (first p after h1)
      if (h1 && h1.nextElementSibling && h1.nextElementSibling.tagName === 'P' && !h1.nextElementSibling.classList.contains('button-container')) {
        h1.nextElementSibling.className = 'hero-video-description';
      }
    }
    // Remove the row wrapper, elevate the content cell
    contentRow.replaceWith(cell || contentRow);
  }
}
