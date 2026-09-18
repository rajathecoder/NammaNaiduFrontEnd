export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main',
    'header', 'footer', 'aside', 'figure', 'figcaption',
    'p', 'div', 'span', 'a', 'img', 'b', 'i', 'strong', 'em', 'u',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'hr',
    'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'code', 'pre'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      if (!allowedTags.has(tagName)) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value;

        if (attrName.startsWith('on')) {
          el.removeAttribute(attrName);
          continue;
        }

        if (tagName === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attrName);
          continue;
        }

        if (attrName === 'href' || attrName === 'src' || attrName === 'action') {
          // eslint-disable-next-line no-control-regex
          const cleanUrl = attrValue.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (attrValue.trim().toLowerCase().startsWith('javascript:') || cleanUrl.startsWith('javascript:')) {
            el.removeAttribute(attrName);
            continue;
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
