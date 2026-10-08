export const sanitizeHtml = (html: string): string => {
  // Fail securely in SSR
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', // needed for DOMParser roots
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'p', 'br', 'b', 'i', 'strong', 'em', 'u', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div', 'blockquote', 'code', 'pre'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      if (!allowedTags.has(tagName)) {
        el.remove();
        return;
      }

      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value;

        // Strip inline event handlers
        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Special iframe rules
        if (tagName === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // URI checks for src, href, data, etc.
        if (attrName === 'href' || attrName === 'src' || attrName === 'data') {
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
  };

  cleanNode(doc.body);

  return doc.body.innerHTML;
};
