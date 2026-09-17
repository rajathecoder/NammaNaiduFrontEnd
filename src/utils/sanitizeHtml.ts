export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'strong', 'em', 'b', 'i', 'u', 's', 'span', 'a', 'img', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main',
    'header', 'footer', 'aside', 'figure', 'figcaption'
  ]);

  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x1F\ufffd]/g;

  function cleanElement(el: Element) {
    const tagName = el.tagName.toLowerCase();

    if (!allowedTags.has(tagName)) {
      el.parentNode?.removeChild(el);
      return;
    }

    if (tagName === 'iframe' && el.hasAttribute('srcdoc')) {
      el.removeAttribute('srcdoc');
    }

    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      let value = attr.value;

      const cleanedValue = value.replace(controlCharRegex, '');
      if (value !== cleanedValue) {
         el.setAttribute(attr.name, cleanedValue);
         value = cleanedValue;
      }

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }

      const trimmedValue = value.trim().toLowerCase();
      if (
        (name === 'href' || name === 'src') &&
        (trimmedValue.startsWith('javascript:') || trimmedValue.startsWith('vbscript:') || trimmedValue.startsWith('data:text/html'))
      ) {
        el.removeAttribute(attr.name);
        continue;
      }
    }

    const children = Array.from(el.children);
    for (const child of children) {
      cleanElement(child);
    }
  }

  cleanElement(doc.documentElement);
  return doc.body.innerHTML;
}
