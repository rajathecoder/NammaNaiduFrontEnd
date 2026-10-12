export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body',
    'div', 'span', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'b', 'i', 'strong', 'em', 'u', 's', 'strike', 'sub', 'sup',
    'a', 'img', 'video', 'audio', 'source', 'iframe', 'object',
    'article', 'section', 'nav', 'main', 'header', 'footer', 'aside',
    'figure', 'figcaption', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'blockquote', 'pre', 'code', 'q', 'abbr', 'cite'
  ]);

  function cleanNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();

        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (el.tagName.toLowerCase() === 'iframe' && name === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (name === 'href' || name === 'src' || name === 'data') {
          // eslint-disable-next-line no-control-regex
          const cleanVal = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('data:')) {
            el.removeAttribute(attr.name);
            continue;
          }
        }
      }

      Array.from(el.childNodes).forEach(cleanNode);
    }
  }

  cleanNode(doc.body);

  return doc.body.innerHTML;
}
