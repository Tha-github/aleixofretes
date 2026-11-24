import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { business } from '../src/config/business.js';

const root = import.meta.dirname + '/..';
const seoMarker = '  <!-- seo:build -->';

export async function buildSite(config = business, output = join(root, 'dist')) {
  const source = await readFile(join(root, 'index.html'), 'utf8');
  const title = source.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = source.match(/<meta name="description" content="([^"]+)">/)?.[1];
  const hero = source.match(/<img\b[^>]*\bid="hero-image"[^>]*>/)?.[0];
  const imageAlt = hero?.match(/\balt="([^"]+)"/)?.[1];
  if (!title || !description || !imageAlt || !source.includes(seoMarker)) {
    throw new Error('index.html precisa de título, descrição, imagem do hero com texto alternativo e marcador SEO.');
  }

  const canonical = canonicalUrl(config.siteUrl);
  const image = config.heroImage;
  await stat(join(root, image.path));
  if (image.small) await stat(join(root, image.small.path));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: config.name,
    description,
    sameAs: [config.instagramUrl],
    ...(canonical && { url: canonical, '@id': canonical + '#empresa' }),
  };

  const metadata = [
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', 'pt_BR'),
    meta('property', 'og:site_name', config.name),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('name', 'twitter:card', canonical ? 'summary_large_image' : 'summary'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
  ];

  let robots = 'User-agent: *\nAllow: /\n';
  if (canonical) {
    const socialImagePath = config.socialImagePath || image.path;
    await stat(join(root, socialImagePath));
    const imageUrl = new URL(socialImagePath, canonical).href;
    metadata.push(
      '  <link rel="canonical" href="' + escapeMarkup(canonical) + '">',
      meta('property', 'og:url', canonical),
      meta('property', 'og:image', imageUrl),
      meta('property', 'og:image:alt', imageAlt),
      meta('name', 'twitter:image', imageUrl),
      meta('name', 'twitter:image:alt', imageAlt),
    );
    robots += 'Sitemap: ' + new URL('sitemap.xml', canonical).href + '\n';
  }

  const jsonLd = JSON.stringify(schema, null, 2).replaceAll('<', '\\u003c');
  metadata.push('  <script type="application/ld+json">\n' + jsonLd + '\n  </script>');
  const heroAttributes = [
    'src="' + escapeMarkup(image.path) + '"',
    'width="' + image.width + '"',
    'height="' + image.height + '"',
  ];
  if (image.small) {
    const sources = image.small.path + ' ' + image.small.width + 'w, ' + image.path + ' ' + image.width + 'w';
    heroAttributes.push(
      'srcset="' + escapeMarkup(sources) + '"',
      'sizes="' + escapeMarkup(image.sizes) + '"',
    );
  }

  const whatsappUrl = /^[1-9]\d{7,14}$/.test(config.whatsappNumber)
    ? 'https://wa.me/' + config.whatsappNumber
    : config.instagramUrl;

  const html = source.replace(seoMarker, () => metadata.join('\n'))
    .replace(/\bdata-instagram href="[^"]+"/g, () => 'data-instagram href="' + escapeMarkup(config.instagramUrl) + '"')
    .replace(/\bdata-whatsapp href="[^"]+"/g, () => 'data-whatsapp href="' + escapeMarkup(whatsappUrl) + '"')
    .replace(hero, () => hero.replace(/\s+src="[^"]*"/, '')
      .replace('fetchpriority=', heroAttributes.join(' ') + ' fetchpriority='));

  await mkdir(output, { recursive: true });
  await Promise.all([
    cp(join(root, 'src'), join(output, 'src'), { recursive: true }),
    cp(join(root, 'assets'), join(output, 'assets'), { recursive: true }),
    cp(join(root, 'site.webmanifest'), join(output, 'site.webmanifest')),
    cp(join(root, '_headers'), join(output, '_headers')),
    writeFile(join(output, 'index.html'), html),
    writeFile(join(output, 'robots.txt'), robots),
  ]);

  const sitemapPath = join(output, 'sitemap.xml');
  if (canonical) {
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + '  <url><loc>' + escapeMarkup(canonical) + '</loc></url>\n'
      + '</urlset>\n';
    await writeFile(sitemapPath, sitemap);
  } else {
    await rm(sitemapPath, { force: true });
  }
}

function canonicalUrl(value) {
  if (value === null) return null;

  const url = URL.parse(value);
  if (!url || url.protocol !== 'https:' || url.username || url.password || url.port
      || url.pathname !== '/' || url.href !== url.origin + '/') {
    throw new Error('business.siteUrl deve conter somente a origem HTTPS do domínio final.');
  }
  return url.href;
}

function meta(attribute, name, content) {
  return '  <meta ' + attribute + '="' + name + '" content="' + escapeMarkup(content) + '">';
}

function escapeMarkup(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

if (import.meta.main) await buildSite();
