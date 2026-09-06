export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const cleanNode = (node: Node) => {
    // Remove script elements
    if (node.nodeName.toLowerCase() === 'script') {
      node.parentNode?.removeChild(node);
      return;
    }

    // Clean element attributes
    if (node.nodeType === 1) { // Element node
      const el = node as Element;

      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        // Remove on* event handlers
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Check href and src for javascript: URIs (handling control chars & \ufffd)
        if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanVal = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').trim().toLowerCase();
          if (cleanVal.startsWith('javascript:')) {
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
