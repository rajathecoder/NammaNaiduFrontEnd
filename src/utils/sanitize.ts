export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeUnsafeNodes = (node: Node) => {
    // Remove scripts, styles, objects, embeds, iframes, etc.
    const unsafeTags = ['script', 'style', 'object', 'embed', 'iframe', 'frame', 'frameset', 'applet', 'meta', 'base'];
    if (node.nodeType === 1) { // Element node
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (unsafeTags.includes(tagName)) {
        element.remove();
        return;
      }

      // Check attributes for javascript:, vbscript:, data:, etc.
      const attributes = Array.from(element.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        // Remove event handlers (on*)
        if (attrName.startsWith('on')) {
          element.removeAttribute(attr.name);
          continue;
        }

        // Check for unsafe URIs in href, src, action, etc.
        if (['href', 'src', 'action', 'formaction', 'data'].includes(attrName)) {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').trim().toLowerCase();
          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('vbscript:') || cleanValue.startsWith('data:text/html')) {
            element.removeAttribute(attr.name);
          }
        }
      }

      // Recursively sanitize children
      // We iterate backwards because childNodes is a live NodeList and removing a node affects indices
      for (let i = element.childNodes.length - 1; i >= 0; i--) {
        removeUnsafeNodes(element.childNodes[i]);
      }
    }
  };

  // Start sanitization from the body element
  if (doc.body) {
    for (let i = doc.body.childNodes.length - 1; i >= 0; i--) {
      removeUnsafeNodes(doc.body.childNodes[i]);
    }
    return doc.body.innerHTML;
  }

  return '';
}
