export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'html', 'head', 'body', // required for traversal
    'div', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'br', 'hr',
    'blockquote', 'pre', 'code', 'iframe', 'video', 'audio', 'source',
    'article', 'section', 'nav', 'main', 'header', 'footer', 'aside',
    'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody',
    'thead', 'tfoot'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();

        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        if (name === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        if (name === 'href' || name === 'src') {
          const val = attr.value;
          // eslint-disable-next-line no-control-regex
          let cleanVal = val.replace(/[\x00-\x1F\x7F]/g, '').trim();

          if (cleanVal.includes('&')) {
            const txt = document.createElement('textarea');
            txt.innerHTML = cleanVal;
            cleanVal = txt.value;
          }

          const noWhitespace = cleanVal.replace(/\s+/g, '').toLowerCase();

          if (noWhitespace.startsWith('javascript:') || noWhitespace.startsWith('data:') || noWhitespace.startsWith('vbscript:')) {
            el.removeAttribute(attr.name);
          }
        }
      }

      Array.from(el.childNodes).forEach(cleanNode);
    }
  };

  Array.from(doc.body.childNodes).forEach(cleanNode);
  return doc.body.innerHTML;
}
