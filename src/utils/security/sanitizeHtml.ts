// 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = new Set([
    'iframe', 'video', 'audio', 'source', 'article', 'section', 'nav', 'main', 'header',
    'footer', 'aside', 'figure', 'figcaption', 'img', 'table', 'tr', 'td', 'th', 'tbody',
    'thead', 'tfoot', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a',
    'strong', 'em', 'b', 'i', 'u', 'span', 'div', 'br', 'hr', 'blockquote', 'code', 'pre'
  ]);

  const cleanNode = (node: Element) => {
    const tag = node.tagName.toLowerCase();
    if (!allowedTags.has(tag) && !['html', 'head', 'body'].includes(tag)) {
      node.remove();
      return;
    }
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') {
        node.removeAttribute(attr.name);
      } else if (['href', 'src', 'data'].includes(name)) {
        // eslint-disable-next-line no-control-regex
        const url = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
        if (url.startsWith('javascript:') || url.startsWith('data:')) {
          node.removeAttribute(attr.name);
        }
      }
    });
    Array.from(node.children).forEach(cleanNode);
  };

  Array.from(doc.body.children).forEach(cleanNode);
  return doc.body.innerHTML;
}