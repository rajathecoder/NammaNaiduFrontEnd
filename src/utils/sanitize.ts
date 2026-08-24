/**
 * Custom sanitization utility as a fallback for missing security libraries.
 * WARNING: Custom HTML sanitizers are generally considered a security anti-pattern
 * and can be bypassed in certain contexts. Prefer established libraries like dompurify
 * if dependency additions are permitted.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // Use DOMParser to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  // Strip script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Remove on* event handlers and javascript: URIs across all elements
  const allElements = doc.querySelectorAll('*');

  // eslint-disable-next-line no-control-regex
  const controlCharsRegex = /[\x00-\x1F\x7F\ufffd]/g;

  allElements.forEach((el) => {
    // Remove attributes that start with 'on' (event handlers)
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });

    // Check href and src attributes for javascript: URIs (stripping control chars and null byte replacements)
    const href = el.getAttribute('href');
    if (href && href.replace(controlCharsRegex, '').trim().toLowerCase().startsWith('javascript:')) {
      el.removeAttribute('href');
    }

    const src = el.getAttribute('src');
    if (src && src.replace(controlCharsRegex, '').trim().toLowerCase().startsWith('javascript:')) {
      el.removeAttribute('src');
    }
  });

  return doc.body.innerHTML;
}
