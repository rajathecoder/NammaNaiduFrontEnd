export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', // jsdom wrappers
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav',
    'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img',
    'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a',
    'strong', 'em', 'u', 'br', 'hr', 'div', 'span', 'b', 'i'
  ]);

  const isUriAttribute = (attrName: string) => {
    return ['href', 'src', 'action', 'data', 'poster'].includes(attrName);
  };

  const sanitizeNode = (node: Element) => {
    const tagName = node.nodeName.toLowerCase();

    if (!allowedTags.has(tagName)) {
      node.remove();
      return;
    }

    const attributes = node.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      const attrName = attr.name.toLowerCase();

      // Block inline event handlers
      if (attrName.startsWith('on')) {
        node.removeAttribute(attr.name);
        continue;
      }

      // Block srcdoc
      if (attrName === 'srcdoc') {
        node.removeAttribute(attr.name);
        continue;
      }

      if (isUriAttribute(attrName)) {
        // eslint-disable-next-line no-control-regex
        const cleanUrl = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
        if (cleanUrl.startsWith('javascript:') || cleanUrl.startsWith('data:')) {
          node.removeAttribute(attr.name);
        }
      }
    }

    const children = Array.from(node.children);
    for (const child of children) {
      sanitizeNode(child);
    }
  };

  if (doc.body) {
    const children = Array.from(doc.body.children);
    for (const child of children) {
      sanitizeNode(child);
    }
    return doc.body.innerHTML;
  }

  return '';
};
