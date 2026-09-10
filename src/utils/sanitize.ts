export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Security Enhancement: Mitigate XSS by strictly allowing specific tags and attributes.
  const allowedTags = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'
  ]);
  const allowedAttributes = new Set(['href', 'title', 'target', 'class', 'style']);

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();

      if (tag !== 'body' && tag !== 'html' && tag !== 'head' && !allowedTags.has(tag)) {
        el.remove();
        return;
      }

      if (tag !== 'body' && tag !== 'html' && tag !== 'head') {
        for (let i = el.attributes.length - 1; i >= 0; i--) {
          const attr = el.attributes[i];
          if (!allowedAttributes.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          } else if (attr.name.toLowerCase() === 'href') {
            // eslint-disable-next-line no-control-regex
            const cleanVal = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').trim();
            if (cleanVal.toLowerCase().startsWith('javascript:')) {
              el.removeAttribute(attr.name);
            } else {
              el.setAttribute(attr.name, cleanVal);
            }
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  if (!doc.body) return '';
  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
