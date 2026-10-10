export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'div', 'span',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main',
    'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr',
    'td', 'th', 'tbody', 'thead', 'tfoot',
    'html', 'head', 'body'
  ]);

  const sanitizeNode = (node: Element) => {
    const tagName = node.tagName.toLowerCase();

    if (!allowedTags.has(tagName)) {
      node.remove();
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

      if (['href', 'src', 'data', 'action', 'formaction'].includes(attrName)) {
        // eslint-disable-next-line no-control-regex
        const cleanValue = attrValue.replace(/[\x00-\x1F\s]/g, '').toLowerCase();

        if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('data:')) {
          node.removeAttribute(attr.name);
        }
      }
    }

    const children = Array.from(node.children);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  sanitizeNode(doc.documentElement);

  return doc.body ? doc.body.innerHTML : '';
};
