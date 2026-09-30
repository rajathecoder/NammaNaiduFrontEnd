export function sanitizeHTML(html: string): string {
  // 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'span', 'div', 'blockquote',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main',
    'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'html', 'head', 'body'
  ]);

  function cleanNode(node: Node) {
    if (node.nodeType === 1) { // ELEMENT_NODE
      const el = node as Element;

      if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
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

        if (el.tagName.toLowerCase() === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (['href', 'src', 'data', 'action', 'formaction'].includes(attrName)) {
          // eslint-disable-next-line no-control-regex
          const cleanVal = attrValue.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('data:')) {
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

  cleanNode(doc.documentElement);

  return doc.body.innerHTML;
}
