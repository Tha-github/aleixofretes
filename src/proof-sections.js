export function renderProofSections(business) {
  const target = document.getElementById('provas');

  const photos = business.galleryImages.filter(photo => photo?.path?.trim() && photo.alt?.trim());
  const testimonials = business.testimonials.filter(item => item?.authorized === true && item.quote?.trim());

  renderSection(target, 'gallery-template', photos, (entry, photo) => {
    const image = entry.querySelector('img');
    image.alt = photo.alt.trim();
    image.src = photo.path.trim();
    renderCaption(entry, photo.caption);
  });

  renderSection(target, 'testimonials-template', testimonials, (entry, testimonial) => {
    entry.querySelector('blockquote p').textContent = testimonial.quote.trim();
    renderCaption(entry, testimonial.author);
  });
}

function renderSection(target, templateId, items, populate) {
  if (items.length === 0) return;

  const section = document.getElementById(templateId).content.cloneNode(true);
  const list = section.querySelector('ul');
  const itemTemplate = section.querySelector('template');

  for (const item of items) {
    const entry = itemTemplate.content.cloneNode(true);
    populate(entry, item);
    list.append(entry);
  }

  itemTemplate.remove();
  target.append(section);
}

function renderCaption(entry, text) {
  const caption = entry.querySelector('figcaption');

  if (text?.trim()) {
    caption.textContent = text.trim();
  } else {
    caption.remove();
  }
}
