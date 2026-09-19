export function sanitizeHTML(input: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  const allowedTags = new Set([
    'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'span', 'strong', 'ul',
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
    'html', 'head', 'body',
    'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
  ]);

  function cleanElement(node: Node) {
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

        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (tagName === 'iframe' && attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (['href', 'src'].includes(attrName)) {
          const attrVal = attr.value;
          // eslint-disable-next-line no-control-regex
          let cleanedVal = attrVal.replace(/[\s\x00-\x1F\x7F]+/g, '').toLowerCase();
          cleanedVal = cleanedVal.replace(/&#[xX]?[0-9a-fA-F]+;/g, '').replace(/&[a-zA-Z]+;/g, '');

          if (cleanedVal.startsWith('javascript:') || cleanedVal.startsWith('vbscript:') || cleanedVal.startsWith('data:')) {
            el.removeAttribute(attr.name);
          }
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanElement(child);
    }
  }

  cleanElement(doc.body);
  return doc.body.innerHTML;
}
