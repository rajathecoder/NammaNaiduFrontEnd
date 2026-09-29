export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'strong', 'b', 'em', 'i', 'u', 's', 'span', 'div',
    'a', 'img', 'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'article', 'section', 'nav', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption',
    'iframe', 'video', 'audio', 'source'
  ];

  const allowedAttributes = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'style', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'];

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Skip structural tags injected by DOMParser in Node.js
      if (tagName === 'html' || tagName === 'head' || tagName === 'body') {
        const children = Array.from(element.childNodes);
        children.forEach(cleanNode);
        return;
      }

      if (!allowedTags.includes(tagName)) {
        element.parentNode?.removeChild(element);
        return;
      }

      const attributes = Array.from(element.attributes);
      for (const attr of attributes) {
        if (!allowedAttributes.includes(attr.name.toLowerCase())) {
          element.removeAttribute(attr.name);
          continue;
        }

        // Explicitly check for 'srcdoc' attribute and strip it, as required by memory
        if (attr.name.toLowerCase() === 'srcdoc') {
          element.removeAttribute(attr.name);
          continue;
        }

        // Reject inline event handlers
        if (attr.name.toLowerCase().startsWith('on')) {
           element.removeAttribute(attr.name);
           continue;
        }

        // Sanitize URIs in href and src
        if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
           // eslint-disable-next-line no-control-regex
           const uri = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
           if (uri.startsWith('javascript:') || uri.startsWith('data:') || uri.startsWith('vbscript:')) {
               element.removeAttribute(attr.name);
           }
        }
      }

      const children = Array.from(element.childNodes);
      children.forEach(cleanNode);
    }
  };

  const children = Array.from(doc.body.childNodes);
  children.forEach(cleanNode);

  return doc.body.innerHTML;
};
