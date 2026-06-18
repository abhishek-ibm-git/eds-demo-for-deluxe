/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsProductParser from './parsers/cards-product.js';
import storyBannerParser from './parsers/story-banner.js';
import tabsSolutionsParser from './parsers/tabs-solutions.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsServicesParser from './parsers/cards-services.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/deluxe-cleanup.js';
import sectionsTransformer from './transformers/deluxe-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Deluxe homepage - AEM-authored page with featured products hero, story banner, solutions slider, statistics slider, flash cards, news & updates, and CTA sections',
  urls: [
    'https://www.deluxe.com/'
  ],
  blocks: [
    {
      name: 'cards-product',
      instances: ['div.featuredproductsherogen3v1']
    },
    {
      name: 'story-banner',
      instances: ['div.homestorybannergen3v1']
    },
    {
      name: 'tabs-solutions',
      instances: ['div.solutionslidegen3v2']
    },
    {
      name: 'cards-stats',
      instances: ['div.statisticslidergen3v1']
    },
    {
      name: 'cards-services',
      instances: ['div.flashcardsvariation2gen3v1']
    },
    {
      name: 'cards-news',
      instances: ['div.newsandupdatesgen3v1']
    }
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Featured Products Hero',
      selector: 'div.featuredproductsherogen3v1',
      style: null,
      blocks: ['cards-product'],
      defaultContent: [
        'div.featured-products-hero-gen3v1__content__title',
        'div.featured-products-hero-gen3v1__content__description'
      ]
    },
    {
      id: 'rc2',
      name: 'Story Banner',
      selector: 'div.homestorybannergen3v1',
      style: null,
      blocks: ['story-banner'],
      defaultContent: []
    },
    {
      id: 'rc3',
      name: 'Solutions Slider',
      selector: 'div.solutionslidegen3v2',
      style: null,
      blocks: ['tabs-solutions'],
      defaultContent: ['div.solutions-slide-gen3-v2_head-content']
    },
    {
      id: 'rc4',
      name: 'Statistics Slider',
      selector: 'div.statisticslidergen3v1',
      style: 'stats-blue',
      blocks: ['cards-stats'],
      defaultContent: ['div.redesign-about-us__slider-title']
    },
    {
      id: 'rc5',
      name: 'Proven Success Flash Cards',
      selector: 'div.flashcardsvariation2gen3v1',
      style: null,
      blocks: ['cards-services'],
      defaultContent: ['div.flashing-cards-variation-2__title-container']
    },
    {
      id: 'rc6',
      name: 'News and Insights',
      selector: 'div.newsandupdatesgen3v1',
      style: null,
      blocks: ['cards-news'],
      defaultContent: []
    },
    {
      id: 'rc7',
      name: 'Get Started CTA',
      selector: 'div.postctagen3v1',
      style: 'cta-red',
      blocks: [],
      defaultContent: ['div.postctagen3v1']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'cards-product': cardsProductParser,
  'story-banner': storyBannerParser,
  'tabs-solutions': tabsSolutionsParser,
  'cards-stats': cardsStatsParser,
  'cards-services': cardsServicesParser,
  'cards-news': cardsNewsParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections transformer runs after (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
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
