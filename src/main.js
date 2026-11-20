import { business } from './config/business.js';
import { renderProofSections } from './proof-sections.js';
import { initQuoteForm } from './quote-form.js';

const hero = document.querySelector('.hero');
const heroImage = document.querySelector('#hero-image');

hero.style.setProperty('--hero-position-desktop', business.heroImage.desktopPosition);
hero.style.setProperty('--hero-position-mobile', business.heroImage.mobilePosition);
if (!heroImage.hasAttribute('width')) {
  const { path, width, height, sizes, small } = business.heroImage;
  heroImage.width = width;
  heroImage.height = height;
  if (small) {
    heroImage.sizes = sizes;
    heroImage.srcset = small.path + ' ' + small.width + 'w, ' + path + ' ' + width + 'w';
  }
  heroImage.src = path;
}

const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById(toggle.getAttribute('aria-controls'));
const header = toggle.closest('.site-header');
toggle.hidden = false;

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
});

header.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    event.preventDefault();
    closeMenu();
    toggle.focus();
  }
});

nav.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');

  if (link && toggle.getAttribute('aria-expanded') === 'true') {
    document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
    closeMenu();
  }
});

header.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) {
    closeMenu();
  }
});

const desktop = window.matchMedia('(min-width: 63rem)');
desktop.addEventListener('change', () => {
  if (!desktop.matches && nav.contains(document.activeElement)) {
    toggle.focus();
  }
  closeMenu();
});

for (const link of document.querySelectorAll('[data-instagram]')) {
  link.href = business.instagramUrl;
}

initQuoteForm(business);
renderProofSections(business);

document.getElementById('footer-year').textContent = new Date().getFullYear();
