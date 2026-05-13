/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const video = element.querySelector('video.hero-bg-img, video[class*="hero-bg"], video');
    const image = element.querySelector('img[class*="hero-bg"], img[class*="background"], picture');
    let mediaElement = null;
    if (video) {
      const videoSrc = video.getAttribute("src") || "";
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        mediaElement = videoLink;
      }
    } else if (image) {
      mediaElement = image;
    }
    const contentContainer = element.querySelector('.hero-content, [class*="hero-content"]');
    const textFragment = document.createDocumentFragment();
    if (contentContainer) {
      const eyebrow = contentContainer.querySelector('.hero-eyebrow, [class*="eyebrow"]');
      if (eyebrow) {
        const eyebrowP = document.createElement("p");
        eyebrowP.textContent = eyebrow.textContent.trim();
        textFragment.appendChild(eyebrowP);
      }
      const headline = contentContainer.querySelector('h1, h2, .hero-headline, [class*="headline"]');
      if (headline) {
        const h1 = document.createElement("h1");
        h1.textContent = headline.textContent.trim();
        textFragment.appendChild(h1);
      }
      const subheadline = contentContainer.querySelector('p.hero-subheadline, p[class*="subheadline"], .hero-subheadline');
      if (subheadline) {
        const p = document.createElement("p");
        p.textContent = subheadline.textContent.trim();
        textFragment.appendChild(p);
      }
      const ctaLinks = contentContainer.querySelectorAll('a.hero-cta, a[class*="cta"], a[class*="button"]');
      ctaLinks.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "#";
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFragment.appendChild(p);
      });
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (mediaElement) {
      imageCell.appendChild(mediaElement);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    textCell.appendChild(textFragment);
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-spotlight.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".spotlight-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.spotlight-card-img");
      const label = card.querySelector("span.spotlight-card-label");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", img.getAttribute("src"));
        imgEl.setAttribute("alt", img.getAttribute("alt") || "");
        picture.appendChild(imgEl);
        imageCell.appendChild(picture);
      }
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (label) {
        const p = document.createElement("p");
        p.textContent = label.textContent.trim();
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-spotlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-pillars.js
  function parse3(element, { document }) {
    const pillarItems = element.querySelectorAll(".know-pillar");
    const cells = [];
    pillarItems.forEach((pillar) => {
      const headEl = pillar.querySelector(".know-pillar-head");
      const bodyEl = pillar.querySelector(".know-pillar-reveal .know-pillar-body, .know-pillar-reveal");
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(" field:summary "));
      if (headEl) {
        summaryFrag.appendChild(headEl);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (bodyEl) {
        textFrag.appendChild(bodyEl);
      }
      cells.push([summaryFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-pillars", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-casestudy.js
  function parse4(element, { document }) {
    const parentSection = element.closest("section") || element.parentElement;
    if (element.classList.contains("trusted-panel")) {
      const empty = document.createTextNode("");
      element.replaceWith(empty);
      return;
    }
    const tabsContainer = element;
    const panelContainer = parentSection.querySelector(".trusted-panel");
    const tabButtons = Array.from(tabsContainer.querySelectorAll("button.trusted-tab"));
    const panelInner = panelContainer ? panelContainer.querySelector(".trusted-panel-inner") : null;
    const activeIndex = tabButtons.findIndex((tab) => tab.classList.contains("trusted-tab--active"));
    const activePanelIndex = activeIndex >= 0 ? activeIndex : 0;
    const cells = [];
    tabButtons.forEach((tab, index) => {
      const tabImg = tab.querySelector("img.trusted-tab-img");
      const tabTitle = tabImg ? tabImg.getAttribute("alt") || "" : "";
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(" field:title "));
      const titleP = document.createElement("p");
      titleP.textContent = tabTitle;
      titleCell.appendChild(titleP);
      const contentCell = document.createDocumentFragment();
      if (index === activePanelIndex && panelInner) {
        const headline = panelInner.querySelector("h3.trusted-panel-headline, h3, h2");
        if (headline) {
          contentCell.appendChild(document.createComment(" field:content_heading "));
          const h3 = document.createElement("h3");
          h3.textContent = headline.textContent.trim();
          contentCell.appendChild(h3);
        }
      }
      if (tabImg) {
        contentCell.appendChild(document.createComment(" field:content_image "));
        const imgP = document.createElement("p");
        const imgClone = tabImg.cloneNode(true);
        imgP.appendChild(imgClone);
        contentCell.appendChild(imgP);
      }
      if (index === activePanelIndex && panelInner) {
        const tag = panelInner.querySelector(".trusted-card-tag");
        const body = panelInner.querySelector("p.trusted-card-body, .trusted-card-body");
        const cta = panelInner.querySelector("a.trusted-cta, a");
        const stats = panelInner.querySelectorAll(".trusted-stat");
        const hasRich = tag || body || cta || stats.length > 0;
        if (hasRich) {
          contentCell.appendChild(document.createComment(" field:content_richtext "));
          if (tag) {
            const tagP = document.createElement("p");
            tagP.textContent = tag.textContent.trim();
            contentCell.appendChild(tagP);
          }
          if (body) {
            contentCell.appendChild(body.cloneNode(true));
          }
          if (cta) {
            const ctaClone = cta.cloneNode(true);
            ctaClone.querySelectorAll('img[src^="data:"]').forEach((svg) => svg.remove());
            const ctaP = document.createElement("p");
            ctaP.appendChild(ctaClone);
            contentCell.appendChild(ctaP);
          }
          stats.forEach((stat) => {
            const val = stat.querySelector(".trusted-stat-val");
            const label = stat.querySelector(".trusted-stat-label");
            if (val || label) {
              const statP = document.createElement("p");
              if (val) {
                const strong = document.createElement("strong");
                strong.textContent = val.textContent.trim();
                statP.appendChild(strong);
              }
              if (label) {
                statP.appendChild(document.createTextNode(" " + label.textContent.trim()));
              }
              contentCell.appendChild(statP);
            }
          });
        }
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-casestudy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse5(element, { document }) {
    const statItems = element.querySelectorAll(":scope > .by-numbers-stat");
    const cells = [];
    statItems.forEach((stat) => {
      const val = stat.querySelector(".by-numbers-val");
      const label = stat.querySelector(".by-numbers-label");
      const shortLabel = stat.querySelector(".by-numbers-short");
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (val) {
        const heading = document.createElement("h4");
        heading.textContent = val.textContent.trim();
        textFrag.appendChild(heading);
      }
      if (label) {
        const p = document.createElement("p");
        p.textContent = label.textContent.trim();
        textFrag.appendChild(p);
      }
      if (shortLabel) {
        const p = document.createElement("p");
        p.textContent = shortLabel.textContent.trim();
        textFrag.appendChild(p);
      }
      const imageCell = "";
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll(".insight-bd-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".insight-bd-image > img");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        imageCell.appendChild(img.cloneNode(true));
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const badgeLabel = card.querySelector(".insight-bd-badge");
      if (badgeLabel) {
        const badgeText = badgeLabel.childNodes;
        let labelText = "";
        badgeText.forEach((node) => {
          if (node.nodeType === 3) {
            labelText += node.textContent.trim();
          }
        });
        if (labelText) {
          const badgeEl = document.createElement("p");
          badgeEl.textContent = labelText;
          textCell.appendChild(badgeEl);
        }
      }
      const personName = card.querySelector(".insight-bd-name");
      const personRole = card.querySelector(".insight-bd-role");
      if (personName) {
        const nameEl = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = personName.textContent.trim();
        nameEl.appendChild(strong);
        if (personRole) {
          nameEl.appendChild(document.createElement("br"));
          nameEl.appendChild(document.createTextNode(personRole.textContent.trim()));
        }
        textCell.appendChild(nameEl);
      }
      const category = card.querySelector(".insight-bd-category");
      if (category) {
        const catEl = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = category.textContent.trim();
        catEl.appendChild(em);
        textCell.appendChild(catEl);
      }
      const headline = card.querySelector(".insight-bd-headline");
      if (headline) {
        const headingEl = document.createElement("h4");
        headingEl.textContent = headline.textContent.trim();
        textCell.appendChild(headingEl);
      }
      const excerpt = card.querySelector(".insight-bd-excerpt");
      if (excerpt) {
        const excerptEl = document.createElement("p");
        excerptEl.textContent = excerpt.textContent.trim();
        textCell.appendChild(excerptEl);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse7(element, { document }) {
    const label = element.querySelector(".stay-form-label, label");
    const input = element.querySelector(".stay-form-input, input");
    const button = element.querySelector(".stay-form-btn, button");
    const legalText = element.querySelector(".stay-form-legal, p");
    const referenceFrag = document.createDocumentFragment();
    referenceFrag.appendChild(document.createComment(" field:reference "));
    const referenceLink = document.createElement("a");
    referenceLink.href = "/forms/subscribe";
    referenceLink.textContent = "/forms/subscribe";
    referenceFrag.appendChild(referenceLink);
    const actionFrag = document.createDocumentFragment();
    actionFrag.appendChild(document.createComment(" field:action "));
    const actionLink = document.createElement("a");
    actionLink.href = "/forms/subscribe/submit";
    actionLink.textContent = "/forms/subscribe/submit";
    actionFrag.appendChild(actionLink);
    const cells = [
      [referenceFrag],
      [actionFrag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sei-demo-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["next-route-announcer", ".scroll-progress"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["nav.nav", "footer.footer"]);
    }
  }

  // tools/importer/transformers/sei-demo-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "carousel-spotlight": parse2,
    "accordion-pillars": parse3,
    "tabs-casestudy": parse4,
    "cards-stats": parse5,
    "cards-insights": parse6,
    "form": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "SEI Demo homepage with hero, content sections, and call-to-action areas",
    urls: [
      "https://sei-demo-nextjs.vercel.app/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["section.hero"]
      },
      {
        name: "carousel-spotlight",
        instances: ["section.spotlight .spotlight-carousel-outer"]
      },
      {
        name: "accordion-pillars",
        instances: ["section.know-sei .know-sei-grid"]
      },
      {
        name: "tabs-casestudy",
        instances: ["section.trusted .trusted-tabs", "section.trusted .trusted-panel"]
      },
      {
        name: "cards-stats",
        instances: ["section.by-numbers .by-numbers-grid"]
      },
      {
        name: "cards-insights",
        instances: ["section.insights-bd .insights-bd-grid"]
      },
      {
        name: "form",
        instances: ["section.stay-connected .stay-form"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.hero",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Executive Spotlight",
        selector: "section.spotlight",
        style: null,
        blocks: ["carousel-spotlight"],
        defaultContent: [
          "section.spotlight .section-eyebrow",
          "section.spotlight .spotlight-headline",
          "section.spotlight .spotlight-body"
        ]
      },
      {
        id: "section-3",
        name: "Get to Know SEI",
        selector: "section.know-sei",
        style: null,
        blocks: ["accordion-pillars"],
        defaultContent: [
          "section.know-sei .section-eyebrow",
          "section.know-sei .section-headline",
          "section.know-sei .section-body"
        ]
      },
      {
        id: "section-4",
        name: "Proof in Practice",
        selector: "section.trusted",
        style: "grey",
        blocks: ["tabs-casestudy"],
        defaultContent: [
          "section.trusted .section-eyebrow",
          "section.trusted .section-headline",
          "section.trusted .trusted-header-sub"
        ]
      },
      {
        id: "section-5",
        name: "Scale and Impact",
        selector: "section.by-numbers",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: [
          "section.by-numbers .by-numbers-eyebrow",
          "section.by-numbers .by-numbers-headline",
          "section.by-numbers .by-numbers-sub"
        ]
      },
      {
        id: "section-6",
        name: "Expert Insights",
        selector: "section.insights-bd",
        style: null,
        blocks: ["cards-insights"],
        defaultContent: [
          "section.insights-bd .section-eyebrow",
          "section.insights-bd .insights-bd-headline",
          "section.insights-bd .insights-bd-all-cta"
        ]
      },
      {
        id: "section-7",
        name: "Stay Connected",
        selector: "section.stay-connected",
        style: "dark",
        blocks: ["form"],
        defaultContent: [
          "section.stay-connected .stay-eyebrow",
          "section.stay-connected .stay-headline",
          "section.stay-connected .stay-body"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
