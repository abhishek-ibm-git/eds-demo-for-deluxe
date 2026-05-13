/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form variant.
 * Base block: form
 * Source selector: section.stay-connected .stay-form
 * UE Model fields: reference (aem-content), action (text/string)
 * Generated: 2026-05-13
 *
 * The form block in AEM EDS expects two links:
 *   Row 1 (reference): A link to the form JSON definition
 *   Row 2 (action): A link to the form submit/action endpoint
 *
 * Source HTML is an inline email subscription form. The parser extracts
 * available content and produces the correct block table structure for
 * the xwalk form block model.
 */
export default function parse(element, { document }) {
  // Extract form-related content from source
  const label = element.querySelector('.stay-form-label, label');
  const input = element.querySelector('.stay-form-input, input');
  const button = element.querySelector('.stay-form-btn, button');
  const legalText = element.querySelector('.stay-form-legal, p');

  // Build form reference link (Row 1: reference field)
  // In AEM EDS, the form block references a form definition JSON.
  // Create a placeholder link pointing to a form definition path derived from context.
  const referenceFrag = document.createDocumentFragment();
  referenceFrag.appendChild(document.createComment(' field:reference '));
  const referenceLink = document.createElement('a');
  referenceLink.href = '/forms/subscribe';
  referenceLink.textContent = '/forms/subscribe';
  referenceFrag.appendChild(referenceLink);

  // Build action URL (Row 2: action field)
  // The action field holds the submit endpoint URL.
  const actionFrag = document.createDocumentFragment();
  actionFrag.appendChild(document.createComment(' field:action '));
  const actionLink = document.createElement('a');
  actionLink.href = '/forms/subscribe/submit';
  actionLink.textContent = '/forms/subscribe/submit';
  actionFrag.appendChild(actionLink);

  const cells = [
    [referenceFrag],
    [actionFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
