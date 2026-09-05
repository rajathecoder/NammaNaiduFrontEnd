/**
 * Simple HTML sanitizer fallback using DOMParser.
 * Note: A full library like DOMPurify is strongly recommended for production,
 * but this serves as a fallback to strip common XSS vectors without adding dependencies.
 */

export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Tags to remove entirely
  const dangerousTags = ['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'MATH', 'SVG'];

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (dangerousTags.includes(el.tagName)) {
        el.remove();
        return;
      }

      // Check attributes for 'on*' event handlers or 'javascript:' URIs
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
        } else if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
          // eslint-disable-next-line no-control-regex
          const val = attr.value.toLowerCase().replace(/[\x00-\x1f\ufffd]/g, '').trim();
          if (val.startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    // Recursively clean child nodes
    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
