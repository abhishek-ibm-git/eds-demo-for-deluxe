/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: SEI Demo site-wide cleanup.
 * Removes non-authorable content (nav, footer, scroll indicator, Next.js announcer).
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove Next.js route announcer and scroll progress indicator that may interfere with parsing
    WebImporter.DOMUtils.remove(element, ['next-route-announcer', '.scroll-progress']);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome: navigation and footer
    // Selectors from captured DOM: nav.nav (line 6), footer.footer (line 360)
    WebImporter.DOMUtils.remove(element, ['nav.nav', 'footer.footer']);
  }
}
