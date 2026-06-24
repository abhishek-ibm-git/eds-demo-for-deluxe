/*
 * Interior Nav variant
 * Sticky in-page anchor navigation. Authors provide a list of links whose
 * hrefs target on-page anchors (e.g. #overview). The block decorates them into
 * a horizontal sticky bar and highlights the active link while scrolling.
 */

export default function decorate(block) {
  // Collect all anchor links authored in the block (typically inside a list).
  const links = [...block.querySelectorAll('a')];

  const nav = document.createElement('nav');
  nav.className = 'interior-nav-bar';
  const ul = document.createElement('ul');
  nav.append(ul);

  const targets = [];
  links.forEach((a) => {
    const li = document.createElement('li');
    const href = a.getAttribute('href') || '';
    // normalise to a hash target
    const hash = href.startsWith('#') ? href : `#${href.split('#').pop()}`;
    a.setAttribute('href', hash);
    li.append(a);
    ul.append(li);
    const id = hash.slice(1);
    if (id) targets.push({ link: a, id });
  });

  block.textContent = '';
  block.append(nav);

  // The source anchor jump-targets (e.g. <div id="overview">) are stripped
  // during import, so the target IDs do not exist on the page. Re-establish
  // them by assigning each nav target's ID, in order, to the content sections
  // that follow this nav's own section.
  const navSection = block.closest('.section');
  if (navSection && targets.length) {
    let sibling = navSection.nextElementSibling;
    let i = 0;
    while (sibling && i < targets.length) {
      if (sibling.classList.contains('section')) {
        if (!sibling.id) sibling.id = targets[i].id;
        i += 1;
      }
      sibling = sibling.nextElementSibling;
    }
  }

  // position:sticky is constrained by its containing block. Inside its own
  // short EDS section the bar releases as soon as that section scrolls past.
  // Hoist the block to be a direct child of <main> (in the same flow position)
  // so the containing block spans the whole page and the bar stays pinned.
  if (navSection && navSection.parentElement) {
    navSection.replaceWith(block);
    block.classList.add('interior-nav-hoisted');
  }

  // Account for the sticky bar height when scrolling so the section heading
  // isn't hidden behind the nav.
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = block.getBoundingClientRect().height;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Smooth-scroll on click
  ul.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (document.getElementById(id)) {
      e.preventDefault();
      scrollToId(id);
    }
  });

  // Active-state highlighting via IntersectionObserver
  if (targets.length && 'IntersectionObserver' in window) {
    const byId = new Map(targets.map((t) => [t.id, t.link]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          targets.forEach((t) => t.link.classList.remove('active'));
          const link = byId.get(entry.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    if (targets[0]) targets[0].link.classList.add('active');
  }
}
