/**
 * A basic HTML sanitizer that uses DOMParser.
 * Note: This is a fallback mitigation against common XSS vectors
 * (like script tags, on* event handlers, and javascript: URIs)
 * due to restricted dependency installation boundaries.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node: Node) => {
    // Remove script tags entirely
    if (node.nodeName.toLowerCase() === 'script') {
      node.parentNode?.removeChild(node);
      return;
    }

    if (node instanceof Element) {
      // Remove attributes that start with "on"
      const attributes = Array.from(node.attributes);
      for (const attr of attributes) {
        if (attr.name.toLowerCase().startsWith('on')) {
          node.removeAttribute(attr.name);
        }
      }

      // Check href and src for javascript: URIs
      const href = node.getAttribute('href');
      if (href && href.trim().toLowerCase().startsWith('javascript:')) {
        node.removeAttribute('href');
      }

      const src = node.getAttribute('src');
      if (src && src.trim().toLowerCase().startsWith('javascript:')) {
        node.removeAttribute('src');
      }
    }

    // Recursively sanitize children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
};