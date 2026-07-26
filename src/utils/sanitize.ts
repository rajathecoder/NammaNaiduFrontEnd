/**
 * Simple HTML sanitizer using DOMParser.
 * Note: For production use, a robust library like DOMPurify is recommended.
 * This function strips out script tags and inline event handlers to prevent basic XSS.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Remove elements with inline event handlers (e.g. onclick, onerror)
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    // Array of attributes to remove
    const attrsToRemove: string[] = [];

    // Iterate over all attributes
    for (let i = 0; i < el.attributes.length; i++) {
      const attrName = el.attributes[i].name;
      // If attribute starts with 'on' (case insensitive) or contains 'javascript:'
      if (attrName.toLowerCase().startsWith('on') ||
          el.attributes[i].value.toLowerCase().includes('javascript:')) {
        attrsToRemove.push(attrName);
      }
    }

    // Remove the bad attributes
    attrsToRemove.forEach(attr => el.removeAttribute(attr));
  });

  return doc.body.innerHTML;
};
