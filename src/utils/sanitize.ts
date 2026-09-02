/**
 * Custom DOMParser HTML sanitizer as a fallback for missing security libraries.
 * 🛡️ Sentinel: Sanitizes HTML content to prevent XSS vulnerabilities.
 */
export const sanitizeHTML = (dirty: string): string => {
  if (!dirty) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (el.tagName.toLowerCase() === 'script') {
        el.remove();
        return;
      }

      const attrsToRemove = [];
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];

        // Remove on* event handlers
        if (attr.name.toLowerCase().startsWith('on')) {
          attrsToRemove.push(attr.name);
        }

        // Check for javascript: URIs in href and src
        if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').toLowerCase();
          if (cleanValue.startsWith('javascript:')) {
            attrsToRemove.push(attr.name);
          }
        }
      }

      attrsToRemove.forEach(name => el.removeAttribute(name));

      // Recursively clean children
      Array.from(el.childNodes).forEach(cleanNode);
    }
  };

  Array.from(doc.body.childNodes).forEach(cleanNode);
  return doc.body.innerHTML;
};
