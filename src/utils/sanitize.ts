// 🛡️ Sentinel: Custom HTML sanitizer to prevent XSS while allowing rich CMS content
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') return '';
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'p', 'br', 'b', 'i', 'strong', 'em', 'u', 's', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'a', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside',
    'figure', 'figcaption', 'iframe', 'video', 'audio', 'source', 'img', 'object',
    'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'html', 'head', 'body'
  ]);

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        el.parentNode?.removeChild(el);
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value;

        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (tagName === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (attrName === 'href' || attrName === 'src' || attrName === 'data') {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attrValue.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('vbscript:') || cleanValue.startsWith('data:')) {
            el.removeAttribute(attr.name);
            continue;
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
