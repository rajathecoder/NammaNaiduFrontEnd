/**
 * Custom HTML Sanitizer (DOMParser based)
 * 🛡️ Sentinel: Used to prevent XSS from CMS content injections
 */

export function sanitizeHTML(html: string | undefined): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove <script> tags and related dangerous tags
  const scripts = doc.querySelectorAll('script, iframe, object, embed, form');
  scripts.forEach((el) => el.remove());

  // Remove on* event handlers and dangerous URIs
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    // Check all attributes
    Array.from(el.attributes).forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.toLowerCase();

      // Remove event handlers (e.g., onclick)
      if (attrName.startsWith('on')) {
        el.removeAttribute(attrName);
      }

      // Remove javascript: URIs from attributes like href, src, etc.
      // eslint-disable-next-line no-control-regex
      const controlCharRegex = /[\x00-\x1f\ufffd]/g;
      const cleanValue = attrValue.replace(controlCharRegex, '').trim();

      if (cleanValue.startsWith('javascript:')) {
        el.removeAttribute(attrName);
      }
    });
  });

  return doc.body.innerHTML;
}
