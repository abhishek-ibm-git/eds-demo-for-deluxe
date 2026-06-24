/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-anthem. Base block: video.
 * Source: https://www.deluxe.com/about-us (div.textblockwithmediagen3v1 —
 * Wistia "Deluxe Brand Anthem 2025" embed in the OVERVIEW section).
 * Generated for xwalk project (field hints: uri, placeholder_image).
 *
 * Simple block (1 column). Model fields:
 *   - uri               (aem-content) — the video source link  → field:uri
 *   - classes           (multiselect) — SKIPPED per hinting Rule 5
 *   - placeholder_image (reference)   — poster thumbnail        → field:placeholder_image
 *   - placeholder_imageAlt (text)     — COLLAPSED (ends in "Alt") into the img alt
 *
 * Row layout (per Video library description + model):
 *   - row 1: block name
 *   - row 2 (field:uri):               video source link
 *   - row 3 (field:placeholder_image): poster thumbnail image
 *
 * Source structure: .redesign-text-block-with-media-gen3-v1_videoblock holds a
 * .video-embed[data-video-id][data-video-provider="wistia"][data-video-title]
 * with an inner <img> poster. The collapsible transcript (.videoDescription)
 * has no corresponding model field and is intentionally not emitted.
 */
export default function parse(element, { document }) {
  const videoBlock = element.querySelector(
    '.redesign-text-block-with-media-gen3-v1_videoblock, [class*="_videoblock"]',
  ) || element;

  const embed = videoBlock.querySelector('.video-embed, [data-video-id]') || videoBlock;

  // --- Video source URI ---
  // Build a watch URL from the provider + id. Wistia: medias/<id>.
  const videoId = embed.getAttribute('data-video-id') || '';
  const provider = (embed.getAttribute('data-video-provider') || '').toLowerCase();
  const videoTitle = embed.getAttribute('data-video-title') || '';
  let videoUrl = '';
  if (videoId) {
    if (provider === 'wistia') {
      videoUrl = `https://fast.wistia.net/embed/iframe/${videoId}`;
    } else if (provider === 'youtube') {
      videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    } else if (provider === 'vimeo') {
      videoUrl = `https://vimeo.com/${videoId}`;
    } else {
      videoUrl = videoId;
    }
  }

  // --- Poster / placeholder image ---
  const poster = embed.querySelector('img') || videoBlock.querySelector('img');

  // Empty-block guard.
  if (!videoUrl && !poster) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: video source link (field:uri).
  if (videoUrl) {
    const uriFrag = document.createDocumentFragment();
    uriFrag.appendChild(document.createComment(' field:uri '));
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoTitle || videoUrl;
    uriFrag.appendChild(a);
    cells.push([uriFrag]);
  }

  // Row: poster image (field:placeholder_image). Alt collapses into the img.
  if (poster) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:placeholder_image '));
    imgFrag.appendChild(poster);
    cells.push([imgFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-anthem', cells });
  element.replaceWith(block);
}
