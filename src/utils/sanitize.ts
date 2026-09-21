/**
 * Custom HTML sanitizer to prevent XSS attacks while allowing rich text content
 * from CMS pages.
 */
export const sanitizeHtml = (html: string): string => {
  // SSR guard: fail closed if executed outside a browser environment
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'span', 'div', 'img', 'video', 'audio', 'source', 'iframe',
    'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
    'html', 'head', 'body', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'
  ]);

  const cleanNode = (node: Node) => {
    // Keep text nodes
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      // Remove tags not in allowlist
      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      // Check and sanitize attributes
      Array.from(el.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.trim();

        // Strip inline event handlers
        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          return;
        }

        // Prevent iframe srcdoc execution
        if (el.tagName.toLowerCase() === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          return;
        }

        // Sanitize URL attributes (href, src)
        if (attrName === 'href' || attrName === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanVal = attrValue.replace(/[\x00-\x1F]/g, '').trim().toLowerCase();

          if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('vbscript:') || cleanVal.startsWith('data:text/html')) {
             el.removeAttribute(attr.name);
             return;
          }
        }
      });
    }

    // Recursively clean children
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(cleanNode);
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
};
