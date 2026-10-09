// 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'a', 'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav',
    'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img',
    'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (tagName !== 'html' && tagName !== 'head' && tagName !== 'body' && !ALLOWED_TAGS.has(tagName)) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith('on') || attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (attrName === 'href' || attrName === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('data:')) {
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
