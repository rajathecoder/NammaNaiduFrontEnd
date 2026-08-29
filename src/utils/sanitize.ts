/**
 * Custom HTML Sanitizer
 * Note: A custom DOMParser sanitizer is implemented here to avoid adding unapproved
 * dependencies per the Sentinel persona's strict "Ask first" boundary.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove script, iframe, object, embed, etc.
      if (['script', 'iframe', 'object', 'embed', 'form', 'base', 'meta'].includes(tagName)) {
        element.remove();
        return;
      }

      // Remove on* event attributes and javascript: URIs
      const attributes = Array.from(element.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();
        // Remove null bytes and replacement character to prevent evasion
        // eslint-disable-next-line no-control-regex
        const value = attr.value.toLowerCase().replace(/[\x00-\x1f\ufffd]/g, '').trim();

        if (name.startsWith('on') ||
            ((name === 'href' || name === 'src' || name === 'action') && value.startsWith('javascript:'))) {
          element.removeAttribute(attr.name);
        }
      }
    }

    // Recursively sanitize children
    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  Array.from(doc.body.childNodes).forEach(sanitizeNode);

  return doc.body.innerHTML;
}
