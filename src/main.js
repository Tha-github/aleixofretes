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
const drawer = document.getElementById(toggle.getAttribute('aria-controls'));
const nav = document.getElementById('menu-principal');
const desktopHeader = nav.parentElement;
const desktop = window.matchMedia('(min-width: 63rem)');
toggle.hidden = false;

function syncNavigation() {
  if (desktop.matches) {
    if (drawer.open) drawer.close();
    desktopHeader.append(nav);
  } else {
    const focusWasInNav = nav.contains(document.activeElement);
    drawer.append(nav);
    if (focusWasInNav) toggle.focus();
  }
}

toggle.addEventListener('click', () => {
  toggle.focus();
  drawer.showModal();
  toggle.setAttribute('aria-expanded', 'true');
});

drawer.querySelector('.mobile-menu__close').addEventListener('click', () => drawer.close());
drawer.addEventListener('close', () => {
  toggle.setAttribute('aria-expanded', String(drawer.open));
});
drawer.addEventListener('click', (event) => {
  if (event.target === drawer && event.clientX < drawer.getBoundingClientRect().left) drawer.close();
});

nav.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');

  if (link && drawer.open) {
    drawer.close();
    document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
  }
});

desktop.addEventListener('change', syncNavigation);
syncNavigation();

for (const link of document.querySelectorAll('[data-instagram]')) {
  link.href = business.instagramUrl;
}

initQuoteForm(business);
renderProofSections(business);

document.getElementById('footer-year').textContent = new Date().getFullYear();
