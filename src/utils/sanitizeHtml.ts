// 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return ''; // SSR guard: fail securely
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'a', 'b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'html', 'head', 'body'
  ]);

  const cleanNode = (node: Node) => {
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
          const cleanVal = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('data:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.documentElement);

  return doc.body.innerHTML;
}
