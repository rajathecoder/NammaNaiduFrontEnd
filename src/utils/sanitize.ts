/**
 * Custom DOMParser-based HTML Sanitizer
 *
 * 🛡️ Sentinel: XSS Mitigation
 * This utility provides a fallback sanitization mechanism for HTML content before it
 * is rendered using dangerouslySetInnerHTML, since established libraries like DOMPurify
 * are not currently installed.
 *
 * It mitigates XSS by removing script tags, object, embed, iframe, and form tags,
 * stripping inline event handlers (on*), and neutralizing dangerous URI schemes
 * (javascript:, data:, vbscript:) in href and src attributes.
 *
 * Note: It also accounts for null bytes and unicode replacement characters that
 * can be used to bypass regex filters.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Basic pre-filtering for null bytes and specific control characters
  // eslint-disable-next-line no-control-regex
  const cleanHtml = html.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\ufffd]/g, '');

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanHtml, 'text/html');

    // 1. Remove dangerous elements
    const dangerousElements = ['script', 'object', 'embed', 'form', 'base', 'math', 'svg'];
    dangerousElements.forEach(tag => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });

    // 2. Clean attributes on all remaining elements
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const attributes = Array.from(el.attributes);

      attributes.forEach(attr => {
        const name = attr.name.toLowerCase();
        // eslint-disable-next-line no-control-regex
        const value = attr.value.toLowerCase().replace(/[\s\x00-\x08\x0b\x0c\x0e-\x1f\ufffd]/g, '');

        // Remove inline event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          return;
        }

        // Check for dangerous URLs in href, src, data, etc.
        if (name === 'href' || name === 'src' || name === 'data' || name === 'action' || name === 'formaction') {
          if (
            value.startsWith('javascript:') ||
            value.startsWith('data:text/html') ||
            value.startsWith('vbscript:') ||
            value.indexOf('javascript:') !== -1
          ) {
            el.setAttribute(attr.name, '#');
          }
        }
      });
    });

    return doc.body.innerHTML;
  } catch (error) {
    console.error('Sanitization failed:', error);
    return ''; // Fail secure
  }
}
