export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Allowlist of allowed tags and attributes
  const allowedTags = new Set([
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
    'img', 'span', 'div', 'iframe', 'video', 'audio', 'source',
    'article', 'section', 'nav', 'main', 'header', 'footer', 'aside',
    'figure', 'figcaption', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
    'html', 'head', 'body'
  ]);

  const allowedAttributes = new Set([
    'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
    'width', 'height', 'style', 'controls', 'autoplay', 'loop', 'muted',
    'colspan', 'rowspan'
  ]);

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      // Remove tags not in allowlist
      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.remove();
        return;
      }

      // Check attributes
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];

        // Explicitly strip inline event handlers (on*) and srcdoc
        if (attr.name.toLowerCase().startsWith('on') || attr.name.toLowerCase() === 'srcdoc') {
          el.removeAttribute(attr.name);
          continue;
        }

        // Only allow attributes in allowlist
        if (!allowedAttributes.has(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Prevent javascript: URIs in href and src
        if ((attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') &&
             attr.value.trim().toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    }

    // Recursively clean children
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      cleanNode(node.childNodes[i]);
    }
  };

  cleanNode(doc.documentElement);

  // Extract body content. JSDOM adds html/head/body wrappers.
  return doc.body.innerHTML;
};
