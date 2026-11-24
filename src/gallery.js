{
  const track = document.getElementById('galeria-midias');
  const controls = document.querySelector('.gallery__controls');
  const [previous, next] = controls.querySelectorAll('button');
  const [first, second] = track.children;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateControls() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    controls.hidden = maxScroll <= 1;
    previous.setAttribute('aria-disabled', String(track.scrollLeft <= 1));
    next.setAttribute('aria-disabled', String(track.scrollLeft >= maxScroll - 1));
  }

  function move(button, direction) {
    if (button.getAttribute('aria-disabled') === 'true') return;

    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    track.scrollBy({
      left: direction * step,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  previous.addEventListener('click', () => move(previous, -1));
  next.addEventListener('click', () => move(next, 1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
}
