/**
 * Custom HTML sanitizer using DOMParser.
 * Fallback for missing security libraries.
 */

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      // Remove dangerous elements
      if (['SCRIPT', 'OBJECT', 'EMBED', 'IFRAME', 'FORM'].includes(el.tagName)) {
        el.remove();
        return;
      }

      // Remove dangerous attributes
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];

        // Remove on* event handlers
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Remove javascript: URIs from attributes that can hold them
        if (['href', 'src', 'data', 'action'].includes(attr.name.toLowerCase())) {
          // Replace control characters, non-printable chars, whitespace
          // eslint-disable-next-line no-control-regex
          const val = attr.value.replace(/[\x00-\x1F\x7F-\x9F\s\uFFFD]/g, '').toLowerCase();
          if (val.startsWith('javascript:') || val.startsWith('vbscript:') || val.startsWith('data:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    // Recursively clean children
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      cleanNode(node.childNodes[i]);
    }
  };

  for (let i = doc.body.childNodes.length - 1; i >= 0; i--) {
    cleanNode(doc.body.childNodes[i]);
  }

  return doc.body.innerHTML;
};
