/**
 * A lightweight HTML sanitizer using native DOMParser.
 * Note: For complex requirements, consider using an established library like DOMPurify.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. Remove all script tags
    const scripts = doc.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      scripts[i].parentNode?.removeChild(scripts[i]);
    }

    // 2. Remove all elements with malicious attributes
    const allElements = doc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const attributes = el.attributes;

      for (let j = attributes.length - 1; j >= 0; j--) {
        const attr = attributes[j];

        // Remove on* event handlers (e.g., onclick, onerror)
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
        }

        // Remove javascript: URIs
        if (
          (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src' || attr.name.toLowerCase() === 'action') &&
          attr.value.trim().toLowerCase().startsWith('javascript:')
        ) {
          el.removeAttribute(attr.name);
        }
      }
    }

    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Fail securely by returning plain text stripped of HTML tags
    return html.replace(/<[^>]*>?/gm, '');
  }
};
