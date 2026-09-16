/**
 * Custom HTML sanitizer to prevent XSS vulnerabilities when rendering HTML content.
 * Follows strict security guidelines, specifically stripping inline event handlers
 * and preventing javascript:/vbscript:/data: URI bypasses.
 */
export function sanitizeHtml(html: string): string {
  // SSR guard: if window is undefined, fail closed
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const ALLOWED_TAGS = new Set([
      // Basic formatting
      'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul',
      // Semantic HTML
      'article', 'aside', 'footer', 'header', 'main', 'nav', 'section', 'figure', 'figcaption',
      // Tables
      'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
      // Rich media
      'img', 'audio', 'video', 'source', 'iframe',
      // JSDOM support
      'html', 'head', 'body'
    ]);

    // Recursive sanitization of DOM nodes
    const sanitizeNode = (node: Node) => {
      // If node is an element, validate it
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          // Remove unallowed tags entirely (or replace with text/comment)
          el.remove();
          return;
        }

        // Validate and clean attributes
        const attributes = Array.from(el.attributes);
        for (const attr of attributes) {
          const name = attr.name.toLowerCase();
          const value = attr.value;

          // Strip inline event handlers
          if (name.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
          }

          // Special check for URI attributes
          if (name === 'srcdoc') {
            el.removeAttribute(attr.name);
            continue;
          }
          if (name === 'href' || name === 'src' || name === 'data' || name === 'xlink:href') {
            // Remove control characters (and unicode replacement char that results from null byte parsing)
            // eslint-disable-next-line no-control-regex
            const cleanVal = value.replace(/[\x00-\x1F\x7F\ufffd]/g, '').trim().toLowerCase();
            if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('vbscript:') || cleanVal.startsWith('data:text/html')) {
              el.removeAttribute(attr.name);
              continue;
            }
          }
        }
      }

      // Recursively sanitize child nodes
      // Use Array.from to copy the childNodes list, as we might mutate it during iteration
      Array.from(node.childNodes).forEach(sanitizeNode);
    };

    sanitizeNode(doc.body);

    return doc.body.innerHTML;
  } catch (err) {
    console.error('HTML sanitization error:', err);
    // Fail securely
    return '';
  }
}
