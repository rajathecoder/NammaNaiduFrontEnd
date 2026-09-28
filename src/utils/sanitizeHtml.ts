/**
 * Custom HTML Sanitizer
 * 🛡️ Sentinel: Prevents XSS vulnerabilities in CMS content rendered via dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
  // 🛡️ Sentinel: SSR guard - Fail securely during SSR to prevent XSS before hydration
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Allowlist includes rich media and CMS structures
  const allowedTags = new Set([
    'iframe', 'video', 'audio', 'source', 'article', 'section',
    'nav', 'main', 'header', 'footer', 'aside', 'figure',
    'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody',
    'thead', 'tfoot', 'p', 'div', 'span', 'a', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
    'u', 'br', 'hr', 'blockquote', 'code', 'pre',
    'html', 'head', 'body'
  ]);

  function cleanNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      // Strip unallowed tags
      if (!allowedTags.has(tagName)) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();

        // 🛡️ Sentinel: Strip inline event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // 🛡️ Sentinel: Prevent iframe srcdoc bypass
        if (tagName === 'iframe' && name === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // 🛡️ Sentinel: Clean URI attributes
        if (name === 'href' || name === 'src' || name === 'data' || name === 'action' || name === 'formaction') {
          // Strip whitespace and control chars that can bypass basic matching
          // eslint-disable-next-line no-control-regex
          const cleanUri = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanUri.startsWith('javascript:') || cleanUri.startsWith('data:') || cleanUri.startsWith('vbscript:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  }

  cleanNode(doc.documentElement);
  return doc.body.innerHTML;
}
