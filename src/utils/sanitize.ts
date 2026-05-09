/**
 * Custom lightweight HTML sanitizer to prevent XSS attacks.
 * Uses native DOMParser to avoid adding external dependencies like dompurify.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // List of tags that are potentially dangerous and should be removed entirely
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'style', 'link', 'meta', 'base', 'applet', 'form'];

  dangerousTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // Remove dangerous attributes like event handlers (onclick) or javascript: URIs
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    const attributes = Array.from(el.attributes);
    attributes.forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase().replace(/\s+/g, '');

      // Remove inline event handlers
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }

      // Remove script URIs in href and src
      if ((name === 'href' || name === 'src') && value.includes('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}
