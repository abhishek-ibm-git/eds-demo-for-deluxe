/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base block: columns.
 * Source: https://www.deluxe.com/about-us (div.textblockwithmediagen3v1 — text + media).
 * Generated for xwalk project.
 *
 * COLUMNS block (resourceType columns/v1/columns): 2 columns, 1 row.
 * Per the field-hinting rules, Columns blocks do NOT get field hints — cells
 * hold default content only.
 *   - row 1: block name
 *   - row 2: [ text cell , media cell ]
 *       text cell  = eyebrow label (OVERVIEW) + H2 + H3 + body paragraph(s)
 *       media cell = the media visual (video thumbnail image)
 *
 * Source structure: .redesign-text-block-with-media-gen3-v1_contentblock holds
 * the text (label.rd-deluxe-label, h2.rd-deluxe-title, .rd-deluxe-bodycopy with
 * h3 + p); .redesign-text-block-with-media-gen3-v1_videoblock holds the media
 * (.video-embed > img thumbnail). The full Wistia embed + transcript is handled
 * separately by the video-anthem parser.
 */
export default function parse(element, { document }) {
  const root = element.querySelector(
    '.redesign-text-block-with-media-gen3-v1, [class*="text-block-with-media"]',
  ) || element;

  // --- Text column ---
  const contentBlock = root.querySelector(
    '.redesign-text-block-with-media-gen3-v1_contentblock, [class*="_contentblock"]',
  ) || root;

  const textCell = [];

  const labelEl = contentBlock.querySelector('.rd-deluxe-label, label, [class*="label"]');
  if (labelEl) {
    const p = document.createElement('p');
    p.textContent = labelEl.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) textCell.push(p);
  }

  const titleEl = contentBlock.querySelector('.rd-deluxe-title, h2, [class*="title"]');
  if (titleEl) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    if (h2.textContent) textCell.push(h2);
  }

  // Body copy: preserve inner headings + paragraphs (h3 + p).
  const bodyEl = contentBlock.querySelector('.rd-deluxe-bodycopy, [class*="bodycopy"]');
  if (bodyEl) {
    Array.from(bodyEl.querySelectorAll('h3, p')).forEach((node) => {
      if (node.textContent.replace(/\s+/g, ' ').trim()) textCell.push(node);
    });
  }

  // --- Media column (playable video) ---
  // The video lives in the right column. We emit a link to the video source so
  // EDS can render it as a playable embed, plus the poster image. The source
  // markup carries the provider + id on a .video-embed[data-video-*] element.
  const videoBlock = root.querySelector(
    '.redesign-text-block-with-media-gen3-v1_videoblock, [class*="_videoblock"]',
  );
  const mediaCell = [];
  if (videoBlock) {
    const embed = videoBlock.querySelector('.video-embed, [data-video-id]') || videoBlock;
    const videoId = embed.getAttribute('data-video-id') || '';
    const videoTitle = embed.getAttribute('data-video-title') || '';
    const thumb = videoBlock.querySelector('.video-embed img, img');

    // Provider may be declared on the element, or inferred from the poster URL
    // / any iframe src (the data-video-provider attribute is sometimes stripped
    // before parsing).
    let provider = (embed.getAttribute('data-video-provider') || '').toLowerCase();
    if (!provider) {
      const iframe = videoBlock.querySelector('iframe');
      const hint = `${thumb ? thumb.getAttribute('src') || '' : ''} ${iframe ? iframe.getAttribute('src') || '' : ''}`.toLowerCase();
      if (hint.includes('wistia')) provider = 'wistia';
      else if (hint.includes('youtube') || hint.includes('youtu.be')) provider = 'youtube';
      else if (hint.includes('vimeo')) provider = 'vimeo';
    }

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
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.textContent = videoTitle || videoUrl;
      mediaCell.push(a);
    }
    if (thumb) mediaCell.push(thumb);
  }

  // Empty-block guard.
  if (textCell.length === 0 && mediaCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column, 1-row layout (Columns block — no field hints).
  const cells = [[textCell, mediaCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
