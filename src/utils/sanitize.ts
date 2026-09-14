
// 🛡️ Sentinel: Custom HTML Sanitizer to prevent XSS
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return html;
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeUnsafeNodes = (node: Node) => {
    if (node.nodeType === 1) { // Element node
      const el = node as Element;

      const tagName = el.tagName.toUpperCase();

      // Ignore html, head, body tags during Node traversals for jsdom testing
      if (['HTML', 'HEAD', 'BODY'].includes(tagName)) {
        // Allowed, proceed to attributes and children
      } else if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'APPLET', 'META', 'STYLE', 'LINK', 'BASE'].includes(tagName)) {
        el.parentNode?.removeChild(el);
        return;
      }

      // Check attributes
      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        const name = attr.name.toLowerCase();

        // Remove control characters, null bytes, and unicode replacement chars
        // eslint-disable-next-line no-control-regex
        const cleanValue = attr.value.replace(/[\x00-\x1F\x7F-\x9F\uFFFD]/g, '');

        // 1. Strip inline event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // 2. Check for forbidden URI schemes
        if (name === 'href' || name === 'src' || name === 'action' || name === 'formaction') {
          const trimmedVal = cleanValue.trim().toLowerCase();
          if (
            trimmedVal.startsWith('javascript:') ||
            trimmedVal.startsWith('vbscript:') ||
            trimmedVal.startsWith('data:text/html')
          ) {
            el.removeAttribute(attr.name);
            continue;
          }
        }
      }
    }

    // Process children
    const children = Array.from(node.childNodes);
    for (const child of children) {
      removeUnsafeNodes(child);
    }
  };

  removeUnsafeNodes(doc.body || doc);
  return doc.body ? doc.body.innerHTML : '';
};
