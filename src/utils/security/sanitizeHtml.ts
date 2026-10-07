/**
 * 🛡️ Sentinel: Custom HTML Sanitizer
 *
 * Safely parses and sanitizes HTML content to prevent XSS.
 * Removes dangerous tags (script, object, embed, base) and dangerous attributes
 * (inline event handlers, javascript: URIs, vbscript: URIs, data: URIs on specific tags).
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'span', 'div', 'img', 'video', 'audio', 'source', 'article',
  'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
  'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'iframe', 'blockquote',
  'code', 'pre', 'hr'
]);

const URI_ATTRS = new Set(['href', 'src', 'action', 'data', 'cite', 'poster', 'background']);
const FORBIDDEN_URI_REGEX = /^(?:javascript|vbscript|data):/i;

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return ''; // Fail securely before hydration

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Explicitly ignore html, head, and body tags that DOMParser adds
      if (tagName === 'html' || tagName === 'head' || tagName === 'body') {
        // Do nothing, just continue to children
      } else if (!ALLOWED_TAGS.has(tagName)) {
        el.remove();
        return;
      }

      // Check attributes
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        // Remove inline event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Remove dangerous iframe attributes
        if (tagName === 'iframe' && name === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // Sanitize URIs
        if (URI_ATTRS.has(name)) {
          // eslint-disable-next-line no-control-regex
          const cleanValue = value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (FORBIDDEN_URI_REGEX.test(cleanValue)) {
             el.removeAttribute(attr.name);
             continue;
          }
        }
      }
    }

    // Sanitize children
    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.documentElement);

  // Return the innerHTML of the body created by DOMParser
  return doc.body.innerHTML;
}
