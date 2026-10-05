/**
 * 🛡️ Sentinel: Sanitize HTML content before rendering to prevent XSS
 */

export const sanitizeHtml = (htmlString: string): string => {
  if (typeof window === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const allowedTags = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'span', 'div', 'iframe', 'video', 'audio', 'source', 'article',
    'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
    'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'blockquote'
  ]);

  const cleanNode = (node: Node) => {
    // 1 for Element, 3 for Text
    if (node.nodeType === 3) return;

    if (node.nodeType === 1) {
      const el = node as HTMLElement;

      // Ignore html, head, body as they are wrapper tags added by parser
      const tagName = el.tagName.toLowerCase();
      if (tagName !== 'html' && tagName !== 'head' && tagName !== 'body') {
        if (!allowedTags.has(tagName)) {
           el.remove();
           return;
        }
      }

      // Check attributes
      const attributes = Array.from(el.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();

        // Remove inline event handlers
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Remove srcdoc to prevent arbitrary code execution in iframes
        if (name === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // Check for risky protocols in href and src
        if (name === 'href' || name === 'src') {
          // eslint-disable-next-line no-control-regex
          const cleanValue = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
          if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('data:')) {
             el.removeAttribute(attr.name);
             continue;
          }
        }
      }
    }

    // Process children
    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.body);

  return doc.body.innerHTML;
};