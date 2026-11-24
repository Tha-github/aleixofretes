export function initContactMap(googleMapsUrl) {
  const mapUrl = getMapsUrl(googleMapsUrl);
  if (mapUrl) {
    const mapLink = document.getElementById('contact-map');
    mapLink.href = mapUrl;
    mapLink.hidden = false;
  }
}

function getMapsUrl(value) {
  if (typeof value !== 'string') return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;

    const { hostname, pathname, search } = url;
    const isGoogle = /^(www\.)?google\.com(\.br)?$/.test(hostname);
    const isMaps = /^maps\.google\.com(\.br)?$/.test(hostname);
    const isShortLink = hostname === 'maps.app.goo.gl' && /^\/[\w-]+\/?$/.test(pathname);
    const isLegacyShortLink = hostname === 'goo.gl' && /^\/maps\/[\w-]+\/?$/.test(pathname);
    const isLocation = /^\/maps(?:\/.*)?$/.test(pathname) && (pathname.replace(/\/$/, '') !== '/maps' || search);

    if (isShortLink || isLegacyShortLink || ((isGoogle || isMaps) && isLocation) || (isMaps && pathname === '/' && search)) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}
