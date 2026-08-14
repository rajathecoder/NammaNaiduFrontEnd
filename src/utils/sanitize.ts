export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';

  // Use DOMParser to parse the dirty HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');

  // Function to recursively sanitize nodes
  function cleanNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Remove <script> tags completely
      if (element.tagName.toLowerCase() === 'script') {
        element.remove();
        return;
      }

      // Strip dangerous attributes (on*, javascript: URIs)
      const attributes = Array.from(element.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();
        const value = attr.value.toLowerCase().replace(/\s/g, ''); // normalize for checks

        // Remove event handlers
        if (name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }

        // Remove javascript: from href or src
        if ((name === 'href' || name === 'src')) {
          // eslint-disable-next-line no-control-regex
          const cleanValue = value.replace(/[\x00-\x1f]/g, ''); // Remove control chars
          if (cleanValue.startsWith('javascript:')) {
            element.removeAttribute(attr.name);
          }
        }
      }
    }

    // Clean child nodes
    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
