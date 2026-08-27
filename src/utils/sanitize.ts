/**
 * Security Utility: HTML Sanitizer
 *
 * 🛡️ Sentinel: Fallback custom sanitizer for HTML content since external libraries
 * (like dompurify) are not authorized without permission.
 *
 * Uses DOMParser to parse the HTML string and strip out harmful elements and attributes:
 * - Removes all <script> tags.
 * - Removes all attributes starting with "on" (event handlers).
 * - Removes href/src attributes containing javascript: URIs, explicitly blocking
 *   control characters and null bytes (\ufffd) to prevent bypasses.
 */

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const cleanNode = (node: Node) => {
      // Remove <script> elements completely
      if (node.nodeName.toLowerCase() === 'script') {
        node.parentNode?.removeChild(node);
        return;
      }

      // Check attributes for Element nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const attrs = el.attributes;
        const attrsToRemove: string[] = [];

        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          const name = attr.name.toLowerCase();

          // 1. Remove inline event handlers
          if (name.startsWith('on')) {
            attrsToRemove.push(attr.name);
            continue;
          }

          // 2. Remove javascript: URIs from URL-based attributes
          if (name === 'href' || name === 'src' || name === 'action' || name === 'formaction' || name === 'data') {
            const value = attr.value.toLowerCase();
            // eslint-disable-next-line no-control-regex
            const noControlChars = value.replace(/[\x00-\x1F\x7F\ufffd]/g, '');
            const noWhitespace = noControlChars.replace(/\s+/g, '');

            if (noWhitespace.startsWith('javascript:') || noWhitespace.startsWith('vbscript:') || noWhitespace.startsWith('data:text/html')) {
              attrsToRemove.push(attr.name);
            }
          }
        }

        attrsToRemove.forEach(attrName => el.removeAttribute(attrName));
      }

      // Recursively clean children
      const children = Array.from(node.childNodes);
      for (const child of children) {
        cleanNode(child);
      }
    };

    cleanNode(doc.body);
    return doc.body.innerHTML;
  } catch (err) {
    console.error('Error sanitizing HTML:', err);
    // Fail securely: return empty string if parsing fails
    return '';
  }
};
