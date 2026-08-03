export function sanitizeHTML(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeScriptsAndEvents = (node: Element) => {
    // Remove unsafe elements
    const unsafeTags = [
      'script', 'iframe', 'object', 'embed', 'base', 'meta', 'link', 'style', 'applet'
    ];
    if (unsafeTags.includes(node.tagName.toLowerCase())) {
      node.remove();
      return;
    }

    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();

      // Remove event handlers
      if (attrName.startsWith('on')) {
        node.removeAttribute(attr.name);
        continue;
      }

      // Check for javascript protocols in URI attributes
      if (['href', 'src', 'action', 'formaction', 'data', 'poster', 'background'].includes(attrName) || attrName.includes('href')) {
        // Strip whitespace and control characters to avoid bypasses like `java&#x09;script:`
        // eslint-disable-next-line no-control-regex
        const normalizedValue = attr.value.toLowerCase().replace(/[\s\x00-\x1F\x7F]+/g, '');
        if (normalizedValue.startsWith('javascript:') || normalizedValue.startsWith('vbscript:') || normalizedValue.startsWith('data:text/html')) {
          node.removeAttribute(attr.name);
        }
      }
    }

    const children = Array.from(node.children);
    for (const child of children) {
      removeScriptsAndEvents(child);
    }
  };

  Array.from(doc.body.children).forEach(removeScriptsAndEvents);
  return doc.body.innerHTML;
}
