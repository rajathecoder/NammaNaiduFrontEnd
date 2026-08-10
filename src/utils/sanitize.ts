export function sanitizeHtml(html: string | undefined): string {
  if (!html) return '';

  // Note: Only intended for browser environments
  if (typeof window === 'undefined' || !window.DOMParser) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeScripts = (element: Element | Node) => {
    // Only process elements
    if (element.nodeType !== Node.ELEMENT_NODE) return;
    const el = element as Element;

    if (el.tagName.toLowerCase() === 'script') {
        if (el.parentNode) el.parentNode.removeChild(el);
        return;
    }

    const attributes = el.attributes;
    if (attributes) {
        for (let i = attributes.length - 1; i >= 0; i--) {
            const attr = attributes[i];
            if (attr.name.toLowerCase().startsWith('on')) {
                el.removeAttribute(attr.name);
            }
            if (
                (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') &&
                attr.value.replace(/[\s\t\n\r]/g, '').toLowerCase().startsWith('javascript:')
            ) {
                el.removeAttribute(attr.name);
            }
        }
    }

    const children = el.childNodes;
    if (children) {
        for (let i = children.length - 1; i >= 0; i--) {
            removeScripts(children[i]);
        }
    }
  };

  removeScripts(doc.body);
  return doc.body.innerHTML;
}
