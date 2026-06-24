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

  // tools/importer/import-about-page.js
  var import_about_page_exports = {};
  __export(import_about_page_exports, {
    default: () => import_about_page_default
  });

  // tools/importer/parsers/hero-about.js
  function parse(element, { document }) {
    const root = element.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1, [class*="herofullwidth"]'
    ) || element;
    const image = root.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1__bgimage img, [class*="bgimage"] img, img'
    );
    const details = root.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1__contents-details, [class*="contents-details"]'
    ) || root;
    const labelEl = details.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1__contents-details__label, [class*="__label"]'
    );
    const titleEl = details.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1__contents-details__title, [class*="__title"], h1, h2'
    );
    const descEl = details.querySelector(
      '.herofullwidth-sidebyside-image-gen3-v1__contents-details__description, [class*="__description"]'
    );
    const textNodes = [];
    if (labelEl) {
      const p = document.createElement("p");
      p.textContent = labelEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) textNodes.push(p);
    }
    if (titleEl) {
      const h1 = document.createElement("h1");
      h1.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      if (h1.textContent) textNodes.push(h1);
    }
    if (descEl) {
      const paras = Array.from(descEl.querySelectorAll("p"));
      if (paras.length) {
        paras.forEach((p) => {
          if (p.textContent.replace(/\s+/g, " ").trim()) textNodes.push(p);
        });
      } else {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) textNodes.push(p);
      }
    }
    if (!image && textNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(image);
      cells.push([imageFrag]);
    }
    if (textNodes.length) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textNodes.forEach((n) => textFrag.appendChild(n));
      cells.push([textFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-about", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/interior-nav.js
  function parse2(element, { document }) {
    let links = Array.from(
      element.querySelectorAll('.interior-navigation__links ul li a, [class*="__links"] ul li a')
    );
    if (!links.length) {
      links = Array.from(element.querySelectorAll("ul li a, nav a"));
    }
    const cells = [];
    links.forEach((a) => {
      const target = a.getAttribute("data-href") || a.getAttribute("href") || "";
      const label = a.textContent.replace(/\s+/g, " ").trim();
      if (!target && !label) return;
      const anchor = document.createElement("a");
      anchor.href = target;
      anchor.textContent = label;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:link "));
      frag.appendChild(anchor);
      cells.push([frag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "interior-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const root = element.querySelector(
      '.redesign-text-block-with-media-gen3-v1, [class*="text-block-with-media"]'
    ) || element;
    const contentBlock = root.querySelector(
      '.redesign-text-block-with-media-gen3-v1_contentblock, [class*="_contentblock"]'
    ) || root;
    const textCell = [];
    const labelEl = contentBlock.querySelector('.rd-deluxe-label, label, [class*="label"]');
    if (labelEl) {
      const p = document.createElement("p");
      p.textContent = labelEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) textCell.push(p);
    }
    const titleEl = contentBlock.querySelector('.rd-deluxe-title, h2, [class*="title"]');
    if (titleEl) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      if (h2.textContent) textCell.push(h2);
    }
    const bodyEl = contentBlock.querySelector('.rd-deluxe-bodycopy, [class*="bodycopy"]');
    if (bodyEl) {
      Array.from(bodyEl.querySelectorAll("h3, p")).forEach((node) => {
        if (node.textContent.replace(/\s+/g, " ").trim()) textCell.push(node);
      });
    }
    const videoBlock = root.querySelector(
      '.redesign-text-block-with-media-gen3-v1_videoblock, [class*="_videoblock"]'
    );
    const mediaCell = [];
    if (videoBlock) {
      const embed = videoBlock.querySelector(".video-embed, [data-video-id]") || videoBlock;
      const videoId = embed.getAttribute("data-video-id") || "";
      const videoTitle = embed.getAttribute("data-video-title") || "";
      const thumb = videoBlock.querySelector(".video-embed img, img");
      let provider = (embed.getAttribute("data-video-provider") || "").toLowerCase();
      if (!provider) {
        const iframe = videoBlock.querySelector("iframe");
        const hint = `${thumb ? thumb.getAttribute("src") || "" : ""} ${iframe ? iframe.getAttribute("src") || "" : ""}`.toLowerCase();
        if (hint.includes("wistia")) provider = "wistia";
        else if (hint.includes("youtube") || hint.includes("youtu.be")) provider = "youtube";
        else if (hint.includes("vimeo")) provider = "vimeo";
      }
      let videoUrl = "";
      if (videoId) {
        if (provider === "wistia") {
          videoUrl = `https://fast.wistia.net/embed/iframe/${videoId}`;
        } else if (provider === "youtube") {
          videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        } else if (provider === "vimeo") {
          videoUrl = `https://vimeo.com/${videoId}`;
        } else {
          videoUrl = videoId;
        }
      }
      if (videoUrl) {
        const a = document.createElement("a");
        a.href = videoUrl;
        a.textContent = videoTitle || videoUrl;
        mediaCell.push(a);
      }
      if (thumb) mediaCell.push(thumb);
    }
    if (textCell.length === 0 && mediaCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, mediaCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-infographic.js
  function parse4(element, { document }) {
    const container = element.querySelector(
      '.redesign-media-suite-gen3v1__container, [class*="__container"]'
    ) || element;
    const imageCell = [];
    const imageContainer = container.querySelector('.image-container, [class*="image-container"]');
    const img = (imageContainer || container).querySelector("img");
    if (img) imageCell.push(img);
    const content = container.querySelector('.content-container, [class*="content-container"]') || container;
    const textCell = [];
    const smallTitle = content.querySelector('.small-title, [class*="small-title"]');
    if (smallTitle) {
      const p = document.createElement("p");
      p.textContent = smallTitle.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) textCell.push(p);
    }
    const heading = content.querySelector('.large-title, h2, [class*="title"] h2, h2[class*="title"]');
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      if (h2.textContent) textCell.push(h2);
    }
    const body = content.querySelector('.list-options-item, [class*="list-options-item"]');
    if (body) {
      Array.from(body.querySelectorAll("p")).forEach((p) => {
        if (p.textContent.replace(/\s+/g, " ").trim()) textCell.push(p);
      });
    }
    if (imageCell.length === 0 && textCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-infographic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-services.js
  function parse5(element, { document }) {
    let cards = Array.from(
      element.querySelectorAll(".swiper-slide.flashing-cards-variation-2__item, .swiper-slide.flashing-cards__item")
    );
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(".flashing-cards-variation-2__item, .flashing-cards__item"));
    }
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(".flashing-cards-variation-2__content, .flashing-cards__content")).map((c) => c.closest(".swiper-slide, .flashing-cards-variation-2__item, .flashing-cards__item") || c);
    }
    const cells = [];
    cards.forEach((card) => {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      const img = card.querySelector("img");
      const svg = card.querySelector(".flashing-cards-variation-2__icon-container svg, .flashing-cards__icon-container svg, .icon-active svg, .icon-normal svg");
      const iconSpan = card.querySelector(".flashing-cards-variation-2__icon-container .inline-svg-icon, .flashing-cards__icon-container .inline-svg-icon, .inline-svg-icon");
      if (img) {
        imageFrag.appendChild(img);
      } else if (svg) {
        imageFrag.appendChild(svg);
      } else if (iconSpan) {
        imageFrag.appendChild(iconSpan);
      }
      const content = card.querySelector(".flashing-cards-variation-2__content, .flashing-cards__content") || card;
      const title = content.querySelector('h3, .flashing-cards-variation-2__title, .flashing-cards__title, [class*="title"]');
      let description = content.querySelector('.flashing-cards-variation-2__bodycopy, .flashing-cards__bodycopy, [class*="bodycopy"]');
      if (!description) {
        description = Array.from(content.querySelectorAll("p")).find((p) => !title || !title.contains(p));
      }
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
    const introFrag = document.createDocumentFragment();
    const eyebrowEl = element.querySelector(
      '.flashing-cards-variation-2__label, [class*="__label"]'
    );
    const titleEl = element.querySelector(
      '.flashing-cards-variation-2__page-title, [class*="page-title"], h2'
    );
    const descEl = element.querySelector(
      '.flashing-cards-variation-2__page-description, [class*="page-description"]'
    );
    if (eyebrowEl) {
      const p = document.createElement("p");
      p.textContent = eyebrowEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) introFrag.appendChild(p);
    }
    if (titleEl) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      if (h2.textContent) introFrag.appendChild(h2);
    }
    if (descEl) {
      const p = document.createElement("p");
      p.textContent = descEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) introFrag.appendChild(p);
    }
    element.replaceWith(introFrag, block);
  }

  // tools/importer/parsers/cards-awards.js
  function parse6(element, { document }) {
    let items = Array.from(
      element.querySelectorAll('.dx-wallbox .dx-w-item, [class*="dx-w-item"]')
    );
    if (!items.length) {
      items = Array.from(element.querySelectorAll("article .dx-w-item"));
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const captionEl = item.querySelector("div, p, span");
      const captionText = captionEl ? captionEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!img && !captionText) return;
      let imageCell = "";
      if (img) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        imgFrag.appendChild(img);
        imageCell = imgFrag;
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (captionText) {
        const p = document.createElement("p");
        p.textContent = captionText;
        textFrag.appendChild(p);
      }
      cells.push([imageCell, textFrag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-awards", cells });
    const introFrag = document.createDocumentFragment();
    const labelEl = element.querySelector(
      '.zoom-cards-gen3-v1__contents-details__label, [class*="details__label"]'
    );
    const titleEl = element.querySelector(
      '.zoom-cards-gen3-v1__contents-details-item__title, [class*="details-item__title"], h2'
    );
    if (labelEl) {
      const p = document.createElement("p");
      p.textContent = labelEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) introFrag.appendChild(p);
    }
    if (titleEl) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      if (h2.textContent) introFrag.appendChild(h2);
    }
    element.replaceWith(introFrag, block);
  }

  // tools/importer/parsers/cards-tiles.js
  function parse7(element, { document }) {
    let tiles = Array.from(
      element.querySelectorAll('.product-listing__tiles, [class*="__tiles-4-col"]')
    );
    if (!tiles.length) {
      tiles = Array.from(element.querySelectorAll('[class*="__tiles"]')).filter((t) => t.querySelector("img"));
    }
    const cells = [];
    tiles.forEach((tile) => {
      const imgContainer = tile.querySelector(
        '.product-listing__tiles-image-container, [class*="image-container"]'
      );
      const img = (imgContainer || tile).querySelector("img");
      let imageCell = "";
      if (img) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        const wrapAnchor = img.closest("a");
        if (wrapAnchor) {
          const a = document.createElement("a");
          a.href = wrapAnchor.getAttribute("href") || "";
          a.appendChild(img);
          imgFrag.appendChild(a);
        } else {
          imgFrag.appendChild(img);
        }
        imageCell = imgFrag;
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const headlineEl = tile.querySelector(
        '.product-listing__tiles__headline, h3, [class*="__headline"]'
      );
      if (headlineEl) {
        const headlineLink = headlineEl.querySelector("a");
        const h3 = document.createElement("h3");
        if (headlineLink) {
          const a = document.createElement("a");
          a.href = headlineLink.getAttribute("href") || "";
          a.textContent = headlineLink.textContent.replace(/\s+/g, " ").trim();
          h3.appendChild(a);
        } else {
          h3.textContent = headlineEl.textContent.replace(/\s+/g, " ").trim();
        }
        if (h3.textContent) textFrag.appendChild(h3);
      }
      const bodyEl = tile.querySelector(
        '.product-listing__tiles__bodycopy, [class*="__bodycopy"]'
      );
      if (bodyEl) {
        Array.from(bodyEl.querySelectorAll("p")).forEach((p) => {
          if (p.textContent.replace(/\s+/g, " ").trim()) textFrag.appendChild(p);
        });
      }
      if (!img && textFrag.childNodes.length <= 1) return;
      cells.push([imageCell, textFrag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tiles", cells });
    const introFrag = document.createDocumentFragment();
    const labelEl = element.querySelector(
      '.product-listing__label, [class*="__label"]'
    );
    const titleEl = element.querySelector(
      '.product-listing__pagetitle, [class*="__pagetitle"], h2'
    );
    if (labelEl) {
      const p = document.createElement("p");
      p.textContent = labelEl.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) introFrag.appendChild(p);
    }
    if (titleEl) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      if (h2.textContent) introFrag.appendChild(h2);
    }
    element.replaceWith(introFrag, block);
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
    const isHomepageTemplate = sections.some(
      (s) => s && s.selector === "div.featuredproductsherogen3v1"
    );
    if (isHomepageTemplate) {
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
    }
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

  // tools/importer/transformers/deluxe-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-about-page.js
  var PAGE_TEMPLATE = {
    name: "about-page",
    description: "Deluxe About Us page - AEM-authored page with full-width hero (side-by-side image), interior anchor navigation, text-block-with-media overview + video, media suite (Deluxe+ infographic + copy), who-we-serve flash cards carousel, recognition zoom cards, and a get-to-know product-listing card grid",
    urls: [
      "https://www.deluxe.com/about/"
    ],
    blocks: [
      {
        name: "hero-about",
        instances: ["div.heroimagegen3v1"]
      },
      {
        name: "interior-nav",
        instances: ["div.interiornavigationgen3v1"]
      },
      {
        name: "columns-media",
        instances: ["div.textblockwithmediagen3v1"]
      },
      {
        name: "columns-infographic",
        instances: ["div.mediasuitegen3v1"]
      },
      {
        name: "cards-services",
        instances: ["div.flashcardvariation1gen3v1"]
      },
      {
        name: "cards-awards",
        instances: ["div.zoomcardsgen3v1"]
      },
      {
        name: "cards-tiles",
        instances: ["div.product-listing"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Hero",
        selector: "div.heroimagegen3v1",
        style: null,
        blocks: ["hero-about"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "Interior Navigation",
        selector: "div.interiornavigationgen3v1",
        style: null,
        blocks: ["interior-nav"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Overview",
        selector: "div.textblockwithmediagen3v1",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Deluxe Plus",
        selector: "div.mediasuitegen3v1",
        style: null,
        blocks: ["columns-infographic"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Who We Serve",
        selector: "div.flashcardvariation1gen3v1",
        style: null,
        blocks: ["cards-services"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "Recognition",
        selector: "div.zoomcardsgen3v1",
        style: null,
        blocks: ["cards-awards"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Get To Know Us",
        selector: "div.product-listing",
        style: null,
        blocks: ["cards-tiles"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-about": parse,
    "interior-nav": parse2,
    "columns-media": parse3,
    "columns-infographic": parse4,
    "cards-services": parse5,
    "cards-awards": parse6,
    "cards-tiles": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
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
  var import_about_page_default = {
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
  return __toCommonJS(import_about_page_exports);
})();
