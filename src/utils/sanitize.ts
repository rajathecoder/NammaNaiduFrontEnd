/**
 * Custom HTML Sanitizer Fallback
 * Removes <script>, on* event handlers, and javascript: URIs
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node: Node) => {
    // Remove script elements
    if (node.nodeName.toLowerCase() === 'script') {
      node.parentNode?.removeChild(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      // Remove elements that might execute code or load untrusted content
      const blockedElements = ['iframe', 'object', 'embed', 'form'];
      if (blockedElements.includes(el.nodeName.toLowerCase())) {
        el.parentNode?.removeChild(el);
        return;
      }

      // Check attributes
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        let value = attr.value;

        // Remove on* event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // eslint-disable-next-line no-control-regex
        const controlRegex = /[\x00-\x1f\ufffd]/g;
        value = value.replace(controlRegex, '');

        if (name === 'href' || name === 'src') {
          const lowerValue = value.trim().toLowerCase();
          if (lowerValue.startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    // Recursively sanitize child nodes
    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
