/*
 * Columns Media variant
 * Two-column text-and-media layout (text + video/media side by side).
 * When a column contains a video link (Wistia/YouTube/Vimeo), it is rendered
 * as a poster image with a play button that loads the embed on click.
 */

function embedWistia(url) {
  const id = url.pathname.split('/').filter(Boolean).pop();
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://fast.wistia.net/embed/iframe/${id}?seo=true&videoFoam=true&autoPlay=true"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen" allowfullscreen title="Content from Wistia" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedYoutube(url) {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedVimeo(url) {
  const [, video] = url.pathname.split('/');
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}?autoplay=1"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function buildEmbed(link) {
  const url = new URL(link);
  if (link.includes('wistia')) return embedWistia(url);
  if (link.includes('youtube') || link.includes('youtu.be')) return embedYoutube(url);
  if (link.includes('vimeo')) return embedVimeo(url);
  return null;
}

function buildTranscriptToggle(transcript) {
  const container = document.createElement('div');
  container.className = 'columns-media-transcript';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'columns-media-transcript-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span class="columns-media-transcript-icon">+</span> Video Description';

  const panel = document.createElement('div');
  panel.className = 'columns-media-transcript-panel';
  panel.hidden = true;
  // Move the captured transcript paragraphs into the panel.
  while (transcript.firstChild) panel.append(transcript.firstChild);

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    const icon = toggle.querySelector('.columns-media-transcript-icon');
    if (icon) icon.textContent = expanded ? '+' : '–';
  });

  container.append(toggle, panel);
  return container;
}

function decorateVideoColumn(col) {
  const link = col.querySelector('a[href]');
  if (!link) return false;
  const { href } = link;
  if (!buildEmbed(href)) return false;

  const placeholder = col.querySelector('picture');

  // Collect transcript/description paragraphs. The markdown round-trip flattens
  // the source wrapper, so the transcript is a run of <p> elements in the column
  // (the video link and poster are the only non-transcript content). Capture
  // every <p> that isn't the video link itself.
  const transcript = document.createElement('div');
  transcript.className = 'video-transcript';
  col.querySelectorAll('p').forEach((p) => {
    // Skip paragraphs that only wrap the video link or the poster image.
    if (p.querySelector('a[href], picture, img')) return;
    if (p.textContent.replace(/\s+/g, ' ').trim()) transcript.appendChild(p.cloneNode(true));
  });

  col.textContent = '';
  col.classList.add('columns-media-video-col');

  const wrapper = document.createElement('div');
  wrapper.className = 'columns-media-video';

  if (placeholder) {
    wrapper.append(placeholder);
  }
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'columns-media-video-play';
  playBtn.setAttribute('title', 'Play');
  wrapper.append(playBtn);

  wrapper.addEventListener('click', () => {
    const embed = buildEmbed(href);
    if (embed) {
      wrapper.replaceWith(embed);
    }
  });

  col.append(wrapper);

  // Collapsible transcript / video description below the video.
  if (transcript && transcript.querySelector('p')) {
    col.append(buildTranscriptToggle(transcript));
  }
  return true;
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // setup image / video columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Video column: contains a recognizable video link
      if (decorateVideoColumn(col)) return;

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-media-img-col');
        }
      } else {
        // check for img without picture wrapper (e.g. external images)
        const img = col.querySelector('img');
        if (img) {
          const firstEl = col.firstElementChild;
          const onlyChild = col.children.length === 1 && firstEl.children.length === 1;
          if (onlyChild) {
            col.classList.add('columns-media-img-col');
          }
        }
      }
    });
  });
}
