/**
 * Custom DOMParser HTML sanitizer.
 * Note: A custom sanitizer is used here as a fallback because adding
 * third-party dependencies (like DOMPurify) requires explicit approval.
 */

export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Helper to remove malicious nodes
  const cleanNode = (node: Node) => {
    // Remove script tags entirely
    if (node.nodeName.toLowerCase() === 'script') {
      node.parentNode?.removeChild(node);
      return;
    }

    // Clean attributes
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const attributes = Array.from(el.attributes);

      for (const attr of attributes) {
        // Remove all event handlers
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Clean javascript URIs
        if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
          // Remove null bytes and standard control characters, plus \ufffd
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').toLowerCase();

          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('vbscript:') || cleanValue.startsWith('data:text/html')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    // Recursively clean children
    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.body);

  return doc.body.innerHTML;
}
