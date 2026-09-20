export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = new Set([
    'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
    'html', 'head', 'body'
  ]);

  const sanitizeNode = (node: Element) => {
    const tagName = node.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      node.parentNode?.removeChild(node);
      return;
    }

    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;

      if (attrName.startsWith('on')) {
        node.removeAttribute(attr.name);
        continue;
      }

      if (tagName === 'iframe' && attrName === 'srcdoc') {
        node.removeAttribute(attr.name);
        continue;
      }

      if (['href', 'src'].includes(attrName)) {
        // eslint-disable-next-line no-control-regex
        const cleanVal = attrValue.replace(/[\x00-\x1F\x7F]/g, '').trim();
        try {
          const url = new URL(cleanVal, 'http://dummy.com');
          if (['javascript:', 'vbscript:', 'data:'].includes(url.protocol)) {
            node.removeAttribute(attr.name);
          }
        } catch {
          if (cleanVal.toLowerCase().startsWith('javascript:')) {
            node.removeAttribute(attr.name);
          }
        }
      }
    }

    Array.from(node.children).forEach(sanitizeNode);
  };

  Array.from(doc.body.children).forEach(sanitizeNode);
  return doc.body.innerHTML;
}
