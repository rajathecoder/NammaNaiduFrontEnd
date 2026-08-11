// 🛡️ Sentinel: Custom HTML Sanitizer
// Prevents XSS by removing script tags, on* event handlers, and javascript: URIs.
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') return html; // Fallback for SSR if any

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Remove elements with inline event handlers or dangerous URIs
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    // Remove inline event handlers
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }

    // Remove dangerous href/src attributes
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href') || '';
      if (href.toLowerCase().trim().startsWith('javascript:')) {
        el.removeAttribute('href');
      }
    }
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src') || '';
      if (src.toLowerCase().trim().startsWith('javascript:')) {
        el.removeAttribute('src');
      }
    }
  });

  return doc.body.innerHTML;
}
