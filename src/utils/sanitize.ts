// 🛡️ Sentinel: Custom DOMParser HTML sanitizer fallback.
// Removes script tags, on* event handlers, and javascript: URIs in href/src.

export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeUnsafeElementsAndAttributes = (node: Element) => {
    // Remove <script> tags
    if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME' || node.tagName === 'OBJECT' || node.tagName === 'EMBED') {
      node.remove();
      return;
    }

    // Remove on* event handlers and dangerous href/src
    for (let i = node.attributes.length - 1; i >= 0; i--) {
      const attr = node.attributes[i];
      const name = attr.name.toLowerCase();

      // Remove on* event handlers
      if (name.startsWith('on')) {
        node.removeAttributeNode(attr);
        continue;
      }

      // Check for javascript: URIs in src and href
      if (name === 'href' || name === 'src') {
        let val = attr.value;
        // eslint-disable-next-line no-control-regex
        val = val.replace(/[\x00-\x1f\ufffd]/g, '').trim().toLowerCase();
        if (val.startsWith('javascript:')) {
          node.removeAttributeNode(attr);
        }
      }
    }

    // Recursively process children
    const children = Array.from(node.children);
    for (const child of children) {
      removeUnsafeElementsAndAttributes(child);
    }
  };

  removeUnsafeElementsAndAttributes(doc.body);
  return doc.body.innerHTML;
}
