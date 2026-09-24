// 🛡️ Sentinel: Custom HTML Sanitizer to prevent XSS in CMS content
export function sanitizeHtml(html: string): string {
  // SSR guard: fail closed if not in a browser environment
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', // Required for jsdom/DOMParser wrappers
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'a',
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'blockquote', 'code', 'pre',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer',
    'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'
  ]);

  function sanitizeNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      if (!allowedTags.has(tagName)) {
        el.remove();
        return;
      }

      // Check attributes
      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        // Strip inline event handlers
        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Strip srcdoc on iframe
        if (tagName === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // Check URI attributes
        if (attrName === 'href' || attrName === 'src') {
          let val = attr.value;
          // Strip control characters
          // eslint-disable-next-line no-control-regex
          val = val.replace(/[\x00-\x1F\x7F]/g, '').trim().toLowerCase();

          if (val.startsWith('javascript:') || val.startsWith('vbscript:') || (val.startsWith('data:') && !val.startsWith('data:image/'))) {
            el.removeAttribute(attr.name);
            continue;
          }
        }
      }

      // Recursively sanitize children
      // Convert to array to safely iterate while mutating
      Array.from(el.childNodes).forEach(sanitizeNode);
    } else if (node.nodeType === Node.COMMENT_NODE) {
      // Allow or remove comments? Better remove.
      const parent = node.parentNode;
      if (parent) {
         parent.removeChild(node);
      }
    }
  }

  Array.from(doc.body.childNodes).forEach(sanitizeNode);

  return doc.body.innerHTML;
}
