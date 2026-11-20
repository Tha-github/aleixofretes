export function initQuoteForm({ whatsappNumber, googleMapsUrl }) {
  const mapUrl = getMapsUrl(googleMapsUrl);
  if (mapUrl) {
    const mapLink = document.getElementById('contact-map');
    mapLink.href = mapUrl;
    mapLink.hidden = false;
  }

  if (typeof whatsappNumber !== 'string' || !/^[1-9]\d{7,14}$/.test(whatsappNumber)) return;

  const whatsappUrl = 'https://wa.me/' + whatsappNumber;
  const whatsappLink = document.getElementById('contact-whatsapp');
  whatsappLink.href = whatsappUrl;
  whatsappLink.hidden = false;

  const form = document.getElementById('quote-form');
  const status = document.getElementById('quote-status');
  const retry = document.getElementById('quote-retry');
  const fields = [
    { name: 'name', label: 'Nome', missing: 'Informe seu nome.' },
    { name: 'phone', label: 'WhatsApp para retorno', missing: 'Informe seu WhatsApp para retorno.' },
    { name: 'service', label: 'Serviço', missing: 'Selecione um tipo de serviço.' },
    { name: 'origin', label: 'Origem', missing: 'Informe o local de origem.' },
    { name: 'destination', label: 'Destino', missing: 'Informe o local de destino.' },
    { name: 'date', label: 'Data desejada' },
    { name: 'notes', label: 'Observações' },
  ].map(field => {
    const input = form.elements.namedItem(field.name);
    return { ...field, input, error: document.getElementById(input.id + '-error') };
  });

  function clearOpeningState() {
    status.textContent = '';
    retry.hidden = true;
    retry.removeAttribute('href');
  }

  for (const field of fields) {
    field.input.addEventListener('input', () => {
      clearOpeningState();
      if (field.input.hasAttribute('aria-invalid')) validate(field);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearOpeningState();

    const invalidFields = fields.filter(field => !validate(field));
    if (invalidFields.length > 0) {
      status.textContent = 'Revise os campos indicados para continuar.';
      invalidFields[0].input.focus();
      return;
    }

    const lines = ['Olá! Gostaria de solicitar um orçamento à Aleixo Fretes.', ''];
    for (const { name, label, input } of fields) {
      const value = input.value.trim();
      if (!value) continue;
      const formatted = name === 'date' ? value.split('-').reverse().join('/') : value;
      lines.push(label + ': ' + formatted);
    }

    try {
      const url = whatsappUrl + '?text=' + encodeURIComponent(lines.join('\n'));
      retry.href = url;
      retry.hidden = false;
      status.textContent = 'Abrindo o WhatsApp. Conclua o envio da mensagem por lá.';
      window.location.assign(url);
    } catch {
      status.textContent = retry.hidden
        ? 'Não foi possível preparar a mensagem. Revise os dados ou entre em contato pelo Instagram.'
        : 'Não foi possível abrir o WhatsApp automaticamente. Use o link abaixo para tentar novamente.';
    }
  });

  document.getElementById('quote-unavailable').hidden = true;
  form.hidden = false;
}

function validate({ input, error, missing }) {
  const value = input.value.trim();
  let message = '';

  if (input.validity.badInput) {
    message = 'Informe uma data válida.';
  } else if (input.required && !value) {
    message = missing;
  } else if (input.name === 'phone' && !isReturnPhone(value)) {
    message = 'Informe um número com DDD, como (11) 9XXXX-XXXX, ou use + e o código do país.';
  } else if (input.maxLength > 0 && input.value.length > input.maxLength) {
    message = 'Use até ' + input.maxLength + ' caracteres.';
  } else if (!input.validity.valid) {
    message = input.name === 'date' ? 'Informe uma data válida.' : 'Confira o valor informado.';
  }

  error.textContent = message;
  error.hidden = !message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  return !message;
}

function isReturnPhone(value) {
  if (!/^\+?[\d ().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return value.startsWith('+')
    ? /^[1-9]\d{7,14}$/.test(digits)
    : /^[1-9]\d{9,10}$/.test(digits);
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
