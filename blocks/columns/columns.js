export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      } else {
        // check for img without picture wrapper (e.g. external images)
        const img = col.querySelector('img');
        if (img) {
          const firstEl = col.firstElementChild;
          const onlyChild = col.children.length === 1 && firstEl.children.length === 1;
          if (onlyChild) {
            col.classList.add('columns-img-col');
          }
        }
      }
    });
  });
}
