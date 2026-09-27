const allowedTags = new Set([
  'html', 'head', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
  'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'u', 's', 'span', 'div', 'blockquote',
  'code', 'pre', 'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav',
  'main', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr',
  'td', 'th', 'tbody', 'thead', 'tfoot'
]);

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      if (!allowedTags.has(tag)) {
        el.remove();
        return;
      }
      Array.from(el.attributes).forEach(attr => {
        const name = attr.name.toLowerCase(), val = attr.value.trim();
        if (name.startsWith('on') || (tag === 'iframe' && name === 'srcdoc')) {
          el.removeAttribute(attr.name);
          return;
        }
        if (['href', 'src', 'data'].includes(name)) {
          // eslint-disable-next-line no-control-regex
          const cleanVal = val.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (/^(javascript|vbscript|data):/.test(cleanVal)) {
            el.removeAttribute(attr.name);
          }
        }
      });
    }
    Array.from(node.childNodes).forEach(cleanNode);
  };
  cleanNode(doc.body);
  return doc.body.innerHTML || '';
}
