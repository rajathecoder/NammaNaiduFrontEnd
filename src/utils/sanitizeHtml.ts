export function sanitizeHtml(html: string): string {
  if (!html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      if (element.tagName.toLowerCase() === 'script') {
        element.remove();
        return;
      }

      const attributesToRemove: string[] = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.toLowerCase().replace(/\s/g, '');

        if (attrName.startsWith('on')) {
          attributesToRemove.push(attr.name);
        } else if ((attrName === 'href' || attrName === 'src') && attrValue.includes('javascript:')) {
          attributesToRemove.push(attr.name);
        }
      }

      attributesToRemove.forEach(attrName => {
        element.removeAttribute(attrName);
      });
    }

    // Recursively clean child nodes
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(cleanNode);
  };

  cleanNode(doc.body);

  // eslint-disable-next-line no-control-regex
  return doc.body.innerHTML.replace(/[\x00-\x1f]/g, '');
}