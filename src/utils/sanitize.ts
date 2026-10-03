export function sanitizeHtml(html: string): string {
  // 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
  if (typeof window === 'undefined') return '';
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'html', 'head', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'u', 's',
    'span', 'div', 'blockquote', 'code', 'pre',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav',
    'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img',
    'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'
  ]);

  function cleanNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
        el.parentNode?.removeChild(el);
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (el.tagName.toLowerCase() === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (['href', 'src', 'data'].includes(attrName)) {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('vbscript:') || cleanValue.startsWith('data:')) {
            el.removeAttribute(attr.name);
            continue;
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML || '';
}
