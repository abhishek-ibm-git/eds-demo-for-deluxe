/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: deluxe.com site-wide cleanup.
 *
 * Removes non-authorable site shell/chrome and tracking attributes from the
 * captured DOM so the import contains only page-level authorable content.
 *
 * All selectors below were validated against migration-work/cleaned.html.
 * The scrape captured `main.main_content` only, so there is no <header>,
 * <footer>, <nav>, <script>, <style>, <iframe>, <link>, or <svg> present —
 * the chrome that survives is the experience-fragment ribbon, the breadcrumb,
 * and analytics/tracking data-* attributes.
 *
 * Selectors verified: .xf-content-height, .deluxe-breadcrumb (cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // The importer runs against the full live DOM (document.body), which
    // includes the global header/footer experience fragments, the check
    // modal, the cookie-consent SDK, chat/feedback widgets, and many
    // analytics/tracking pixels. Authorable content lives entirely inside
    // main.main_content, so isolate it: move main to be body's only child.
    const doc = element.ownerDocument;
    const main = element.querySelector('main.main_content')
      || element.querySelector('main');
    if (main) {
      // Detach everything else, keep only the main content.
      Array.from(element.children).forEach((child) => {
        if (child !== main && !main.contains(child)) child.remove();
      });
    }

    // Non-authorable site shell captured inside the content grid:
    //   .xf-content-height  — experience-fragment ribbon (global site shell)
    //   .deluxe-breadcrumb  — breadcrumb chrome
    WebImporter.DOMUtils.remove(element, [
      '.xf-content-height',
      '.deluxe-breadcrumb',
      'script',
      'style',
      'noscript',
      'iframe',
    ]);

    // Session promo/flash-sale modal (e.g. "Free Shipping … PROMOCODE")
    // pops in at import time and is not authorable page content. Remove the
    // modal container by climbing from its promo image / promo-code link.
    const promoSignals = element.querySelectorAll(
      'img[src*="flashSaleModal"], img[src*="freeShip"], a[href*="PROMOCODE"]'
    );
    promoSignals.forEach((signal) => {
      // Climb to a reasonable modal container, then remove it.
      let node = signal;
      for (let hop = 0; hop < 6 && node.parentElement && node.parentElement !== element; hop += 1) {
        const cls = String(node.parentElement.className || '');
        if (/modal|popup|flash|promo|offer/i.test(cls)) {
          node = node.parentElement;
          break;
        }
        node = node.parentElement;
      }
      if (node && node !== element) node.remove();
    });

    // The flash-sale ribbon trigger is a standalone paragraph with no promo
    // image/link, so the signal pass above misses it. Remove short text nodes
    // carrying the promo phrase (guard on length so real content is untouched).
    const PROMO_RE = /Free Shipping\s*&?(amp;)?\s*Handling on Business Check Orders/i;
    element.querySelectorAll('p, span, div').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (PROMO_RE.test(text) && text.length < 200 && el.querySelectorAll('*').length < 3) {
        el.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Safe non-authorable leftovers (none expected from this scrape, but
    // guard in case parsers leave them behind). Selectors are standard
    // safe-removal tags per the transformer reference guide.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
      'style',
    ]);

    // Strip analytics / tracking attributes. Names validated against
    // cleaned.html: data-analytics-component-title, data-analytics-action,
    // data-tab, data-action (19 occurrences total).
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-analytics-component-title');
      el.removeAttribute('data-analytics-action');
      el.removeAttribute('data-tab');
      el.removeAttribute('data-action');
    });
  }
}
