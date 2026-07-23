/**
 * Utility to sanitize HTML content to prevent XSS attacks.
 * Since we don't have DOMPurify installed and prefer not to add new dependencies without asking,
 * we use the browser's DOMParser to strip `<script>` tags and inline event handlers.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove all script tags
  const scripts = doc.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].parentNode?.removeChild(scripts[i]);
  }

  // Remove inline event handlers (e.g., onclick, onload, onerror)
  const allElements = doc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const attributes = Array.from(el.attributes);
    for (const attr of attributes) {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return doc.body.innerHTML;
}
