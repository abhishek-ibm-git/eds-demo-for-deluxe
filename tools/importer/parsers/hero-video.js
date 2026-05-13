/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video
 * Base block: hero
 * Source: https://sei-demo-nextjs.vercel.app/
 * Selector: section.hero
 * Generated: 2026-05-13
 *
 * UE Model fields:
 *   - image (reference) — video/image media
 *   - imageAlt (collapsed into image — skipped)
 *   - text (richtext) — heading, subheadline, CTA
 *
 * Source structure:
 *   section.hero
 *     video.hero-bg-img (background video)
 *     div.hero-bg-pattern (decorative, ignored)
 *     div.hero-content
 *       div.hero-eyebrow (eyebrow text)
 *       h1.hero-headline (main heading)
 *       p.hero-subheadline (subheadline)
 *       a.hero-cta (call-to-action link)
 */
export default function parse(element, { document }) {
  // Extract video or fallback to image for the media/image field
  const video = element.querySelector('video.hero-bg-img, video[class*="hero-bg"], video');
  const image = element.querySelector('img[class*="hero-bg"], img[class*="background"], picture');

  // Build media cell — prefer video, fall back to image
  let mediaElement = null;
  if (video) {
    // Create a link to the video source for import (video src becomes a reference)
    const videoSrc = video.getAttribute('src') || '';
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      mediaElement = videoLink;
    }
  } else if (image) {
    mediaElement = image;
  }

  // Extract text content from hero-content
  const contentContainer = element.querySelector('.hero-content, [class*="hero-content"]');

  // Build richtext content cell
  const textFragment = document.createDocumentFragment();

  if (contentContainer) {
    // Extract eyebrow
    const eyebrow = contentContainer.querySelector('.hero-eyebrow, [class*="eyebrow"]');
    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrow.textContent.trim();
      textFragment.appendChild(eyebrowP);
    }

    // Extract headline (h1 — flatten animated word spans)
    const headline = contentContainer.querySelector('h1, h2, .hero-headline, [class*="headline"]');
    if (headline) {
      const h1 = document.createElement('h1');
      h1.textContent = headline.textContent.trim();
      textFragment.appendChild(h1);
    }

    // Extract subheadline
    const subheadline = contentContainer.querySelector('p.hero-subheadline, p[class*="subheadline"], .hero-subheadline');
    if (subheadline) {
      const p = document.createElement('p');
      p.textContent = subheadline.textContent.trim();
      textFragment.appendChild(p);
    }

    // Extract CTA links
    const ctaLinks = contentContainer.querySelectorAll('a.hero-cta, a[class*="cta"], a[class*="button"]');
    ctaLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '#';
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textFragment.appendChild(p);
    });
  }

  // Build cells array matching UE model: row 1 = image, row 2 = text
  const cells = [];

  // Row 1: image field (video link or image)
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (mediaElement) {
    imageCell.appendChild(mediaElement);
  }
  cells.push([imageCell]);

  // Row 2: text field (richtext content)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  textCell.appendChild(textFragment);
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
