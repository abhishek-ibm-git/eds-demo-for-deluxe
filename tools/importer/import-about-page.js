/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroAboutParser from './parsers/hero-about.js';
import interiorNavParser from './parsers/interior-nav.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsInfographicParser from './parsers/columns-infographic.js';
import cardsServicesParser from './parsers/cards-services.js';
import cardsAwardsParser from './parsers/cards-awards.js';
import cardsTilesParser from './parsers/cards-tiles.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/deluxe-cleanup.js';
import sectionsTransformer from './transformers/deluxe-sections.js';
import dmImagesTransformer from './transformers/deluxe-dm-images.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-page',
  description: 'Deluxe About Us page - AEM-authored page with full-width hero (side-by-side image), interior anchor navigation, text-block-with-media overview + video, media suite (Deluxe+ infographic + copy), who-we-serve flash cards carousel, recognition zoom cards, and a get-to-know product-listing card grid',
  urls: [
    'https://www.deluxe.com/about/'
  ],
  blocks: [
    {
      name: 'hero-about',
      instances: ['div.heroimagegen3v1']
    },
    {
      name: 'interior-nav',
      instances: ['div.interiornavigationgen3v1']
    },
    {
      name: 'columns-media',
      instances: ['div.textblockwithmediagen3v1']
    },
    {
      name: 'columns-infographic',
      instances: ['div.mediasuitegen3v1']
    },
    {
      name: 'cards-services',
      instances: ['div.flashcardvariation1gen3v1']
    },
    {
      name: 'cards-awards',
      instances: ['div.zoomcardsgen3v1']
    },
    {
      name: 'cards-tiles',
      instances: ['div.product-listing']
    }
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Hero',
      selector: 'div.heroimagegen3v1',
      style: null,
      blocks: ['hero-about'],
      defaultContent: []
    },
    {
      id: 'rc2',
      name: 'Interior Navigation',
      selector: 'div.interiornavigationgen3v1',
      style: null,
      blocks: ['interior-nav'],
      defaultContent: []
    },
    {
      id: 'rc3',
      name: 'Overview',
      selector: 'div.textblockwithmediagen3v1',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 'rc4',
      name: 'Deluxe Plus',
      selector: 'div.mediasuitegen3v1',
      style: null,
      blocks: ['columns-infographic'],
      defaultContent: []
    },
    {
      id: 'rc5',
      name: 'Who We Serve',
      selector: 'div.flashcardvariation1gen3v1',
      style: null,
      blocks: ['cards-services'],
      defaultContent: []
    },
    {
      id: 'rc6',
      name: 'Recognition',
      selector: 'div.zoomcardsgen3v1',
      style: null,
      blocks: ['cards-awards'],
      defaultContent: []
    },
    {
      id: 'rc7',
      name: 'Get To Know Us',
      selector: 'div.product-listing',
      style: null,
      blocks: ['cards-tiles'],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-about': heroAboutParser,
  'interior-nav': interiorNavParser,
  'columns-media': columnsMediaParser,
  'columns-infographic': columnsInfographicParser,
  'cards-services': cardsServicesParser,
  'cards-awards': cardsAwardsParser,
  'cards-tiles': cardsTilesParser,
};

// TRANSFORMER REGISTRY
// cleanup runs first (beforeTransform); sections + DM images run after parsing (afterTransform).
// DM transformer is last so it rewrites Scene7 image cells the parsers already built.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
