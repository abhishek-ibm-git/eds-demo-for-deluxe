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

  // Smooth-scroll on click
  ul.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
