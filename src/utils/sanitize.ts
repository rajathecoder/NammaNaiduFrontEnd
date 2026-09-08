export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined' || !window.DOMParser) {
    // Basic fallback for SSR if DOMParser is unavailable
    // Remove script tags and dangerous attributes heuristically
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  // Remove control characters (including null bytes) and replacement character \ufffd before parsing
  // eslint-disable-next-line no-control-regex
  const cleanHtml = html.replace(/[\x00-\x1f\x7f-\x9f\ufffd]/g, '');

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, 'text/html');

  const forbiddenTags = [
    'script', 'iframe', 'object', 'embed', 'form',
    'math', 'svg', 'style', 'base', 'link',
    'meta', 'noscript', 'template'
  ];

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (forbiddenTags.includes(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();

        if (
          name.startsWith('on') ||
          value.startsWith('javascript:') ||
          value.startsWith('vbscript:') ||
          value.startsWith('data:')
        ) {
          el.removeAttribute(attr.name);
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
