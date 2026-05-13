/**
 * A lightweight HTML sanitizer using native DOMParser.
 * Removes dangerous tags and attributes to mitigate XSS risks.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Check if we are in a browser environment with DOMParser available
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    // Fallback for SSR or non-browser environments: basic regex to remove script tags
    // This is not a complete solution, but prevents the most obvious attacks in SSR
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'applet', 'meta', 'link', 'style', 'base'];

  // Remove dangerous tags
  dangerousTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // Remove dangerous attributes
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    // Collect attributes to remove to avoid modifying the collection while iterating
    const attrsToRemove: string[] = [];
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();

      // Remove on* event handlers (e.g., onclick, onerror)
      if (name.startsWith('on')) {
        attrsToRemove.push(attr.name);
      }
      // Remove javascript: and vbscript: URIs
      else if (
        (name === 'href' || name === 'src' || name === 'data') &&
        (value.includes('javascript:') || value.includes('vbscript:') || value.includes('data:text/html'))
      ) {
        attrsToRemove.push(attr.name);
      }
    }

    attrsToRemove.forEach(attrName => el.removeAttribute(attrName));
  });

  return doc.body.innerHTML;
}
