/**
 * Custom HTML Sanitizer to prevent XSS.
 * Note: Use dompurify in the future if a security dependency is approved.
 * This is a fallback to sanitize HTML using DOMParser.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const cleanNode = (node: Element) => {
      // Remove all script tags
      if (node.tagName.toLowerCase() === 'script') {
        node.remove();
        return;
      }

      // Remove on* event handlers and javascript: URIs
      const attributes = node.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        const name = attr.name.toLowerCase();
        let value = attr.value.toLowerCase();

        // eslint-disable-next-line no-control-regex
        value = value.replace(/[\x00-\x1f\ufffd]/g, '');

        if (name.startsWith('on')) {
          node.removeAttribute(attr.name);
        } else if ((name === 'href' || name === 'src') && value.includes('javascript:')) {
          node.removeAttribute(attr.name);
        }
      }

      // Recursively clean children
      const children = Array.from(node.children);
      for (const child of children) {
        cleanNode(child);
      }
    };

    // Clean body
    const elements = Array.from(doc.body.children);
    for (const el of elements) {
      cleanNode(el);
    }

    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Fallback: return escaped HTML or empty string to be safe
    return '';
  }
};
