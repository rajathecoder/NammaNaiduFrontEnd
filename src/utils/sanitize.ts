export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove <script> tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Remove elements with on* event handlers and javascript: URIs
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    // Remove on* attributes
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });

    // Remove javascript: URIs in href and src
    const href = el.getAttribute('href');
    if (href && href.trim().toLowerCase().startsWith('javascript:')) {
      el.removeAttribute('href');
    }

    const src = el.getAttribute('src');
    if (src && src.trim().toLowerCase().startsWith('javascript:')) {
      el.removeAttribute('src');
    }
  });

  return doc.body.innerHTML;
}
