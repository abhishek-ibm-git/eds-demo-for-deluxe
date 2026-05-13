/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import carouselSpotlightParser from './parsers/carousel-spotlight.js';
import accordionPillarsParser from './parsers/accordion-pillars.js';
import tabsCasestudyParser from './parsers/tabs-casestudy.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import formParser from './parsers/form.js';

import seiDemoCleanupTransformer from './transformers/sei-demo-cleanup.js';
import seiDemoSectionsTransformer from './transformers/sei-demo-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'carousel-spotlight': carouselSpotlightParser,
  'accordion-pillars': accordionPillarsParser,
  'tabs-casestudy': tabsCasestudyParser,
  'cards-stats': cardsStatsParser,
  'cards-insights': cardsInsightsParser,
  'form': formParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'SEI Demo homepage with hero, content sections, and call-to-action areas',
  urls: [
    'https://sei-demo-nextjs.vercel.app/'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['section.hero']
    },
    {
      name: 'carousel-spotlight',
      instances: ['section.spotlight .spotlight-carousel-outer']
    },
    {
      name: 'accordion-pillars',
      instances: ['section.know-sei .know-sei-grid']
    },
    {
      name: 'tabs-casestudy',
      instances: ['section.trusted .trusted-tabs', 'section.trusted .trusted-panel']
    },
    {
      name: 'cards-stats',
      instances: ['section.by-numbers .by-numbers-grid']
    },
    {
      name: 'cards-insights',
      instances: ['section.insights-bd .insights-bd-grid']
    },
    {
      name: 'form',
      instances: ['section.stay-connected .stay-form']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.hero',
      style: null,
      blocks: ['hero-video'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Executive Spotlight',
      selector: 'section.spotlight',
      style: null,
      blocks: ['carousel-spotlight'],
      defaultContent: [
        'section.spotlight .section-eyebrow',
        'section.spotlight .spotlight-headline',
        'section.spotlight .spotlight-body'
      ]
    },
    {
      id: 'section-3',
      name: 'Get to Know SEI',
      selector: 'section.know-sei',
      style: null,
      blocks: ['accordion-pillars'],
      defaultContent: [
        'section.know-sei .section-eyebrow',
        'section.know-sei .section-headline',
        'section.know-sei .section-body'
      ]
    },
    {
      id: 'section-4',
      name: 'Proof in Practice',
      selector: 'section.trusted',
      style: 'grey',
      blocks: ['tabs-casestudy'],
      defaultContent: [
        'section.trusted .section-eyebrow',
        'section.trusted .section-headline',
        'section.trusted .trusted-header-sub'
      ]
    },
    {
      id: 'section-5',
      name: 'Scale and Impact',
      selector: 'section.by-numbers',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: [
        'section.by-numbers .by-numbers-eyebrow',
        'section.by-numbers .by-numbers-headline',
        'section.by-numbers .by-numbers-sub'
      ]
    },
    {
      id: 'section-6',
      name: 'Expert Insights',
      selector: 'section.insights-bd',
      style: null,
      blocks: ['cards-insights'],
      defaultContent: [
        'section.insights-bd .section-eyebrow',
        'section.insights-bd .insights-bd-headline',
        'section.insights-bd .insights-bd-all-cta'
      ]
    },
    {
      id: 'section-7',
      name: 'Stay Connected',
      selector: 'section.stay-connected',
      style: 'dark',
      blocks: ['form'],
      defaultContent: [
        'section.stay-connected .stay-eyebrow',
        'section.stay-connected .stay-headline',
        'section.stay-connected .stay-body'
      ]
    }
  ]
};

const transformers = [
  seiDemoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [seiDemoSectionsTransformer] : []),
];

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
