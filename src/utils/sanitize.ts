export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Use a DOMParser to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove <script> tags and any elements with inline event handlers (on*)
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove all elements with on* event handlers
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Strip href and src attributes containing javascript: URIs (preventing XSS vectors)
  const links = doc.querySelectorAll('a, img, iframe, object, embed');
  links.forEach(link => {
    ['href', 'src'].forEach(attrName => {
      const attrValue = link.getAttribute(attrName);
      if (attrValue) {
        // Remove control characters (including null bytes \x00) and unicode replacement characters
        // eslint-disable-next-line no-control-regex
        const cleanValue = attrValue.replace(/[\x00-\x1f\ufffd]/g, '').trim().toLowerCase();

        // Strip the attribute if it starts with javascript: or vbscript: or data:text/html
        if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('vbscript:') || cleanValue.startsWith('data:text/html')) {
          link.removeAttribute(attrName);
        }
      }
    });
  });

  return doc.body.innerHTML;
}
