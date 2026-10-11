export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') return ''; // SSR guard

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a', 'b', 'i', 'u', 's',
    'strong', 'em', 'mark', 'del', 'ins', 'sub', 'sup', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'span', 'div',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'html', 'head', 'body'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        // Remove event handlers
        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Validate URLs in src, href, action
        if (['src', 'href', 'action', 'data'].includes(attrName)) {
          // Remove control characters and whitespace
          // eslint-disable-next-line no-control-regex
          const cleanUrl = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();

          if (cleanUrl.startsWith('javascript:') || cleanUrl.startsWith('data:')) {
            el.removeAttribute(attr.name);
          }
        }

        if (el.tagName.toLowerCase() === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
        }
      }

      const children = Array.from(el.childNodes);
      for (const child of children) {
        cleanNode(child);
      }
    }
  };

  cleanNode(doc.documentElement);
  return doc.body.innerHTML;
}
