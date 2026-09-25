export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return html;
  if (!html) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body',
    'div', 'span', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main',
    'header', 'footer', 'aside', 'figure', 'figcaption', 'img',
    'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'
  ]);

  const clean = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }
    const el = node as Element;
    if (!allowedTags.has(el.tagName.toLowerCase())) {
      el.parentNode?.removeChild(el);
      return;
    }

    if (el.tagName.toLowerCase() === 'iframe' && el.hasAttribute('srcdoc')) {
      el.removeAttribute('srcdoc');
    }

    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      const txt = document.createElement('textarea');
      txt.innerHTML = attr.value;
      // eslint-disable-next-line no-control-regex
      const val = txt.value.replace(/[\s\x00-\x1F]/g, '').toLowerCase();

      if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:')) {
        el.removeAttribute(attr.name);
      }
    });

    Array.from(el.childNodes).forEach(clean);
  };

  clean(doc.documentElement);
  return doc.body.innerHTML || '';
}