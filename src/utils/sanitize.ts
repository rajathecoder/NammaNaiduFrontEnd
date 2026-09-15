export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return ''; // Fail closed in non-browser environments

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', // Important for JSDOM compatibility
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'blockquote',
    'a', 'span', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (attrName === 'href' || attrName === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanVal = attr.value.replace(/[\x00-\x1F\ufffd]/g, '').trim();
          if (cleanVal.toLowerCase().startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.documentElement);

  return doc.body.innerHTML;
};
