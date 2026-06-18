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

  // tools/importer/parsers/cards-product.js
  function parse(element, { document }) {
    const cardsContainer = element.querySelector(
      '.featured-products-hero-gen3v1__content__cards, [class*="content__cards"]'
    );
    const scope = cardsContainer || element;
    const wrappers = Array.from(
      scope.querySelectorAll(
        '.featured-products-hero-gen3v1__content__cards__card-wrapper, [class*="cards__card-wrapper"]'
      )
    );
    const cells = [];
    wrappers.forEach((wrapper) => {
      const card = wrapper.querySelector(
        '.featured-products-hero-gen3v1__content__cards__card, [class*="cards__card"]'
      ) || wrapper;
      const content = card.querySelector(
        '.featured-products-hero-gen3v1__content__cards__card__content, [class*="card__content"]'
      ) || card;
      const iconImg = content.querySelector(
        'img:not(.external-link-icon):not([class*="external-link"]), svg:not([class*="external-link"])'
      );
      const labelEl = content.querySelector(
        '.featured-products-hero-gen3v1__content__cards__card__label, [class*="card__label"]'
      );
      const labelText = labelEl ? labelEl.textContent.trim() : "";
      const textCell = [];
      const additionalLinks = Array.from(
        card.querySelectorAll(
          '.featured-products-hero-gen3v1__content__cards__card__additional-links a, [class*="additional-links"] a'
        )
      );
      if (additionalLinks.length > 0) {
        if (labelText) {
          const heading = document.createElement("h3");
          heading.textContent = labelText;
          textCell.push(heading);
        }
        additionalLinks.forEach((a) => {
          const clean = document.createElement("a");
          clean.href = a.getAttribute("href") || "";
          if (a.getAttribute("title")) clean.title = a.getAttribute("title");
          clean.textContent = a.textContent.replace(/\s+/g, " ").trim();
          textCell.push(clean);
        });
      } else {
        const href = wrapper.tagName === "A" ? wrapper.getAttribute("href") : wrapper.querySelector("a") && wrapper.querySelector("a").getAttribute("href");
        if (href && labelText) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = labelText;
          textCell.push(link);
        } else if (labelText) {
          const heading = document.createElement("h3");
          heading.textContent = labelText;
          textCell.push(heading);
        }
      }
      if (!iconImg && textCell.length === 0) return;
      let imageCellContent = "";
      if (iconImg) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        imgFrag.appendChild(iconImg);
        imageCellContent = imgFrag;
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textCell.forEach((node) => textFrag.appendChild(node));
      cells.push([imageCellContent, textFrag]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/story-banner.js
  function parse2(element, { document }) {
    var _a;
    const root = element.querySelector(".home-story-banner") || element;
    const label = root.querySelector(".home-story-banner__label");
    const title = root.querySelector(".home-story-banner__title");
    const body = root.querySelector(".home-story-banner__bodycopy");
    const cta = root.querySelector(".home-story-banner__cta a");
    const textFrag = document.createDocumentFragment();
    if (label) {
      const p = document.createElement("p");
      p.textContent = label.textContent.trim();
      textFrag.appendChild(p);
    }
    if (title) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      textFrag.appendChild(h2);
    }
    if (body) {
      const p = document.createElement("p");
      p.textContent = body.textContent.trim();
      textFrag.appendChild(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href") || "#");
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textFrag.appendChild(p);
    }
    const source = root.querySelector(".home-story-banner__globe-content video source, video source, video");
    let videoSrc = source ? source.getAttribute("src") || ((_a = source.querySelector("source")) == null ? void 0 : _a.getAttribute("src")) : null;
    if (videoSrc && videoSrc.startsWith("/")) {
      videoSrc = `https://www.deluxe.com${videoSrc}`;
    }
    const videoFrag = document.createDocumentFragment();
    if (videoSrc) {
      const a = document.createElement("a");
      a.setAttribute("href", videoSrc);
      a.textContent = videoSrc;
      videoFrag.appendChild(a);
    }
    if (!label && !title && !body && !videoSrc) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textFrag], [videoFrag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "story-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-solutions.js
  function parse3(element, { document }) {
    const cells = [];
    const withHint = (fieldName, node) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${fieldName} `));
      frag.appendChild(node);
      return frag;
    };
    const buildContentCell = (itemTexts) => {
      const cell = [];
      const headings = itemTexts.filter((t) => t && t.trim());
      if (headings.length === 0) return cell;
      const headingEl = document.createElement("h3");
      headingEl.textContent = headings[0];
      cell.push(withHint("content_heading", headingEl));
      if (headings.length > 1) {
        const ul = document.createElement("ul");
        headings.slice(1).forEach((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          ul.appendChild(li);
        });
        cell.push(withHint("content_richtext", ul));
      }
      return cell;
    };
    const mobileSlides = Array.from(
      element.querySelectorAll(".solutions-slide-gen3-v2_mobile-view .swiper-slide")
    );
    if (mobileSlides.length) {
      mobileSlides.forEach((slide) => {
        const labelEl = slide.querySelector(".solutions-card h3, h3");
        const label = labelEl ? labelEl.textContent.replace(/\s+/g, " ").trim() : "";
        const itemTexts = Array.from(
          slide.querySelectorAll(".solutions-card-content-lists > li h4, .solutions-card-content-lists > li")
        ).map((el) => el.textContent.replace(/\s+/g, " ").trim()).filter((t) => t);
        if (!label && itemTexts.length === 0) return;
        const titleEl = document.createElement("p");
        titleEl.textContent = label;
        const titleCell = label ? [withHint("title", titleEl)] : [];
        const contentCell = buildContentCell(itemTexts);
        cells.push([titleCell, contentCell]);
      });
    } else {
      const tabItems = Array.from(
        element.querySelectorAll(".solutions-slide-gen3-v2_slider-item")
      );
      const panels = Array.from(
        element.querySelectorAll(".solutions-slide-gen3-v2_content-container")
      );
      tabItems.forEach((tabItem, index) => {
        const labelEl = tabItem.querySelector(".solutions-card h3, h3");
        const label = labelEl ? labelEl.textContent.replace(/\s+/g, " ").trim() : "";
        const dataTab = tabItem.getAttribute("data-tab");
        let panel = dataTab ? element.querySelector(`#${CSS.escape(dataTab)}`) : null;
        if (!panel) panel = panels[index] || null;
        const itemTexts = panel ? Array.from(panel.querySelectorAll(".solutions-card-content h4, .solutions-card-content")).map((el) => el.textContent.replace(/\s+/g, " ").trim()).filter((t) => t) : [];
        if (!label && itemTexts.length === 0) return;
        const titleEl = document.createElement("p");
        titleEl.textContent = label;
        const titleCell = label ? [withHint("title", titleEl)] : [];
        const contentCell = buildContentCell(itemTexts);
        cells.push([titleCell, contentCell]);
      });
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse4(element, { document }) {
    let slides = Array.from(
      element.querySelectorAll(".mySwiper2 .swiper-slide.slide-main-content")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".swiper-slide.slide-main-content"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const number = slide.querySelector(":scope > h2, :scope > h1, :scope > h3");
      const subHeading = slide.querySelector(".sub-title__heading, .sub-title > span");
      const desc = slide.querySelector(".sub-desc, .sub-title p, .sub-title > p");
      if (!number && !subHeading && !desc) return;
      const textContent = [];
      if (number) {
        const numHeading = document.createElement("h2");
        numHeading.textContent = number.textContent.trim();
        textContent.push(numHeading);
      }
      if (subHeading) {
        const subTitle = document.createElement("h3");
        subTitle.textContent = subHeading.textContent.trim();
        textContent.push(subTitle);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.replace(/\s+/g, " ").trim();
        textContent.push(p);
      }
      const imageCell = document.createElement("div");
      const textCell = document.createElement("div");
      textCell.appendChild(document.createComment(" field:text "));
      textContent.forEach((node) => textCell.appendChild(node));
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-services.js
  function parse5(element, { document }) {
    let cards = Array.from(
      element.querySelectorAll(".swiper-slide.flashing-cards-variation-2__item")
    );
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(".flashing-cards-variation-2__item"));
    }
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(".flashing-cards-variation-2__content")).map((c) => c.closest(".swiper-slide, .flashing-cards-variation-2__item") || c);
    }
    const cells = [];
    cards.forEach((card) => {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      const img = card.querySelector("img");
      const svg = card.querySelector(".flashing-cards-variation-2__icon-container svg, .icon-active svg, .icon-normal svg");
      if (img) {
        imageFrag.appendChild(img);
      } else if (svg) {
        imageFrag.appendChild(svg);
      }
      const content = card.querySelector(".flashing-cards-variation-2__content") || card;
      const title = content.querySelector('h3, .flashing-cards-variation-2__title, [class*="title"]');
      const description = content.querySelector('p, .flashing-cards-variation-2__bodycopy, [class*="bodycopy"]');
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (title) textFrag.appendChild(title);
      if (description) textFrag.appendChild(description);
      if (!title && !description && !img && !svg) return;
      cells.push([imageFrag, textFrag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-services", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const cells = [];
    const buildTextCell = (titleEl, descEl, linkEl) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:text "));
      if (titleEl) {
        const tag = /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : "h3";
        const h = document.createElement(tag);
        h.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
        if (h.textContent) frag.appendChild(h);
      }
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) frag.appendChild(p);
      }
      if (linkEl) {
        const href = linkEl.getAttribute("href");
        const text = linkEl.textContent.replace(/\s+/g, " ").trim();
        if (href && text) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = text;
          p.appendChild(a);
          frag.appendChild(p);
        }
      }
      return frag;
    };
    const buildImageCell = (img) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      if (img) frag.appendChild(img);
      return frag;
    };
    const hasText = (frag) => frag.querySelector("h1,h2,h3,h4,h5,h6,p,a") !== null;
    const featured = element.querySelector(".news-and-update-gen3-v1__contents-body");
    if (featured) {
      const fImg = featured.querySelector(".news-and-update-gen3-v1__contents-body__image img, img");
      const fTitle = featured.querySelector(".news-and-update-gen3-v1__contents-body__title, h3");
      const fDesc = featured.querySelector(".news-and-update-gen3-v1__contents-body__description, p");
      const fLink = featured.querySelector(".news-and-update-gen3-v1__contents-body__buttons a, a.rd-deluxe-button-primary-red-long");
      const text = buildTextCell(fTitle, fDesc, fLink);
      if (hasText(text)) cells.push([buildImageCell(fImg), text]);
    }
    element.querySelectorAll(".news-and-update-gen3-v1__contents-list__item__row").forEach((item) => {
      const iImg = item.querySelector(".news-and-update-gen3-v1__contents-list__item__image img, img");
      const iTitle = item.querySelector(".news-and-update-gen3-v1__contents-list__item__details__title, h5");
      const iDesc = item.querySelector(".news-and-update-gen3-v1__contents-list__item__details__description, p");
      const iLink = item.querySelector(".news-and-update-gen3-v1__contents-list__item__details__link a, a[aria-label]");
      const text = buildTextCell(iTitle, iDesc, iLink);
      if (hasText(text)) cells.push([buildImageCell(iImg), text]);
    });
    element.querySelectorAll(".news-and-update-gen3-v1__contents__resources-news__item-wrapper").forEach((wrapper) => {
      const rLink = wrapper.querySelector(":scope > a, a");
      const rHeadline = wrapper.querySelector(".news-and-update-gen3-v1__contents__resources-news__item__headline");
      const rDesc = wrapper.querySelector(".news-and-update-gen3-v1__contents__resources-news__item__description");
      const text = buildTextCell(rHeadline, rDesc, rLink);
      if (hasText(text)) cells.push([buildImageCell(null), text]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/deluxe-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const doc = element.ownerDocument;
      const main = element.querySelector("main.main_content") || element.querySelector("main");
      if (main) {
        Array.from(element.children).forEach((child) => {
          if (child !== main && !main.contains(child)) child.remove();
        });
      }
      WebImporter.DOMUtils.remove(element, [
        ".xf-content-height",
        ".deluxe-breadcrumb",
        "script",
        "style",
        "noscript",
        "iframe"
      ]);
      const promoSignals = element.querySelectorAll(
        'img[src*="flashSaleModal"], img[src*="freeShip"], a[href*="PROMOCODE"]'
      );
      promoSignals.forEach((signal) => {
        let node = signal;
        for (let hop = 0; hop < 6 && node.parentElement && node.parentElement !== element; hop += 1) {
          const cls = String(node.parentElement.className || "");
          if (/modal|popup|flash|promo|offer/i.test(cls)) {
            node = node.parentElement;
            break;
          }
          node = node.parentElement;
        }
        if (node && node !== element) node.remove();
      });
      const PROMO_RE = /Free Shipping\s*&?(amp;)?\s*Handling on Business Check Orders/i;
      element.querySelectorAll("p, span, div").forEach((el) => {
        const text = (el.textContent || "").trim();
        if (PROMO_RE.test(text) && text.length < 200 && el.querySelectorAll("*").length < 3) {
          el.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script",
        "style"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-analytics-component-title");
        el.removeAttribute("data-analytics-action");
        el.removeAttribute("data-tab");
        el.removeAttribute("data-action");
      });
    }
  }

  // tools/importer/transformers/deluxe-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const doc = element.ownerDocument;
    const promoPara = doc.createElement("p");
    promoPara.append(doc.createTextNode("Free Shipping & Handling on Business Check Orders*"));
    const promoLink = doc.createElement("a");
    promoLink.setAttribute("href", "https://www.deluxe.com/shopdeluxe/cl/business-checks-banking-products/business-checks/_/N-wha0kw");
    promoLink.textContent = "LEARN MORE";
    promoPara.append(" ", promoLink);
    const promoMeta = WebImporter.Blocks.createBlock(doc, {
      name: "Section Metadata",
      cells: { style: "promo-ribbon" }
    });
    element.prepend(doc.createElement("hr"));
    element.prepend(promoMeta);
    element.prepend(promoPara);
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metaBlock);
      }
      if (i > 0) {
        sectionEl.before(doc.createElement("hr"));
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Deluxe homepage - AEM-authored page with featured products hero, story banner, solutions slider, statistics slider, flash cards, news & updates, and CTA sections",
    urls: [
      "https://www.deluxe.com/"
    ],
    blocks: [
      {
        name: "cards-product",
        instances: ["div.featuredproductsherogen3v1"]
      },
      {
        name: "story-banner",
        instances: ["div.homestorybannergen3v1"]
      },
      {
        name: "tabs-solutions",
        instances: ["div.solutionslidegen3v2"]
      },
      {
        name: "cards-stats",
        instances: ["div.statisticslidergen3v1"]
      },
      {
        name: "cards-services",
        instances: ["div.flashcardsvariation2gen3v1"]
      },
      {
        name: "cards-news",
        instances: ["div.newsandupdatesgen3v1"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Featured Products Hero",
        selector: "div.featuredproductsherogen3v1",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [
          "div.featured-products-hero-gen3v1__content__title",
          "div.featured-products-hero-gen3v1__content__description"
        ]
      },
      {
        id: "rc2",
        name: "Story Banner",
        selector: "div.homestorybannergen3v1",
        style: null,
        blocks: ["story-banner"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Solutions Slider",
        selector: "div.solutionslidegen3v2",
        style: null,
        blocks: ["tabs-solutions"],
        defaultContent: ["div.solutions-slide-gen3-v2_head-content"]
      },
      {
        id: "rc4",
        name: "Statistics Slider",
        selector: "div.statisticslidergen3v1",
        style: "stats-blue",
        blocks: ["cards-stats"],
        defaultContent: ["div.redesign-about-us__slider-title"]
      },
      {
        id: "rc5",
        name: "Proven Success Flash Cards",
        selector: "div.flashcardsvariation2gen3v1",
        style: null,
        blocks: ["cards-services"],
        defaultContent: ["div.flashing-cards-variation-2__title-container"]
      },
      {
        id: "rc6",
        name: "News and Insights",
        selector: "div.newsandupdatesgen3v1",
        style: null,
        blocks: ["cards-news"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Get Started CTA",
        selector: "div.postctagen3v1",
        style: "cta-red",
        blocks: [],
        defaultContent: ["div.postctagen3v1"]
      }
    ]
  };
  var parsers = {
    "cards-product": parse,
    "story-banner": parse2,
    "tabs-solutions": parse3,
    "cards-stats": parse4,
    "cards-services": parse5,
    "cards-news": parse6
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
        if (!block.element.parentNode) return;
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
