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

for (const link of document.querySelectorAll('[data-instagram]')) {
  link.href = business.instagramUrl;
}

initQuoteForm(business);
renderProofSections(business);

document.getElementById('footer-year').textContent = new Date().getFullYear();
