export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeScriptsAndEvents = (node: Element) => {
    // Block common dangerous tags completely
    const tagName = node.tagName.toLowerCase();
    if (tagName === 'script' || tagName === 'object' || tagName === 'embed' || tagName === 'iframe') {
      node.remove();
      return;
    }

    // Check attributes
    const attrs = Array.from(node.attributes);
    for (const attr of attrs) {
      // Block inline events
      if (attr.name.toLowerCase().startsWith('on')) {
        node.removeAttribute(attr.name);
      }

      // Block javascript: URIs in common attributes
      if ((attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src' || attr.name.toLowerCase() === 'data') &&
          attr.value.toLowerCase().includes('javascript:')) {
        node.removeAttribute(attr.name);
      }
    }

    // Recurse through children safely (create array to avoid live mutation issues)
    const children = Array.from(node.children);
    for (const child of children) {
      removeScriptsAndEvents(child);
    }
  };

  removeScriptsAndEvents(doc.body);
  return doc.body.innerHTML;
};
