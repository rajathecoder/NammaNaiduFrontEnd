/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses native DOMParser in browser environments and a regex fallback for SSR/Node.js.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Recursively sanitize nodes
      const sanitizeNode = (node: Element) => {
        // Remove script tags and other dangerous elements
        const dangerousTags = ['script', 'iframe', 'object', 'embed', 'style', 'base'];
        if (dangerousTags.includes(node.nodeName.toLowerCase())) {
          node.remove();
          return;
        }

        // Remove dangerous attributes
        const attributes = Array.from(node.attributes);
        for (const attr of attributes) {
          const attrName = attr.name.toLowerCase();
          const attrValue = attr.value.toLowerCase().trim();

          // Remove event handlers (onclick, onload, etc.)
          if (attrName.startsWith('on')) {
            node.removeAttribute(attr.name);
          }
          // Remove javascript: and data: URIs in href, src, etc.
          else if (
            (attrName === 'href' || attrName === 'src' || attrName === 'action' || attrName === 'formaction') &&
            (attrValue.startsWith('javascript:') || attrValue.startsWith('data:text/html') || attrValue.startsWith('vbscript:'))
          ) {
            node.removeAttribute(attr.name);
          }
        }

        // Sanitize children
        const children = Array.from(node.children);
        for (const child of children) {
          sanitizeNode(child);
        }
      };

      // Start sanitization from body
      const children = Array.from(doc.body.children);
      for (const child of children) {
        sanitizeNode(child);
      }

      return doc.body.innerHTML;
    } else {
      // Fallback for SSR / non-browser environment
      // Strip out <script> tags and basic inline handlers
      let sanitized = html;
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/on[a-z]+="[^"]*"/gi, '');
      sanitized = sanitized.replace(/on[a-z]+='[^']*'/gi, '');
      sanitized = sanitized.replace(/on[a-z]+=[^\s>]+/gi, '');
      sanitized = sanitized.replace(/href="javascript:[^"]*"/gi, '');
      sanitized = sanitized.replace(/href='javascript:[^']*'/gi, '');
      return sanitized;
    }
  } catch (error) {
    // Fail securely by returning empty string on error
    console.error('HTML Sanitization failed', error);
    return '';
  }
}
