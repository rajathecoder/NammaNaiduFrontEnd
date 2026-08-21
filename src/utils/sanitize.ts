/**
 * Security: Custom DOMParser HTML Sanitizer
 * Used as a fallback because adding dependencies (e.g. dompurify) requires explicit permission.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeUnwantedTags = (node: Element) => {
    // Remove dangerous tags
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'base', 'math', 'svg', 'applet'];
    if (dangerousTags.includes(node.tagName.toLowerCase())) {
      node.remove();
      return;
    }

    // Remove dangerous attributes and event handlers
    const dangerousAttributes = ['srcdoc', 'action', 'formaction', 'data'];
    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();

      if (attrName.startsWith('on') || dangerousAttributes.includes(attrName)) {
        node.removeAttribute(attr.name);
      } else if (attrName === 'href' || attrName === 'src' || attrName === 'poster' || attrName === 'background') {
        // eslint-disable-next-line no-control-regex
        const value = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').toLowerCase().trim();
        if (value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:text/html') || value.startsWith('data:image/svg+xml')) {
          node.removeAttribute(attr.name);
        }
      }
    }

    // Recursively sanitize children
    const children = Array.from(node.children);
    for (const child of children) {
      removeUnwantedTags(child);
    }
  };

  removeUnwantedTags(doc.body);
  return doc.body.innerHTML;
};
