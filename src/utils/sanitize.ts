export function sanitizeHTML(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeElements = (tagName: string) => {
    const elements = doc.getElementsByTagName(tagName);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i]);
    }
  };

  removeElements('script');
  removeElements('iframe');
  removeElements('object');
  removeElements('embed');

  const allElements = doc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const attributes = el.attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes[j];
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      if ((attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') &&
          attr.value.toLowerCase().includes('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return doc.body.innerHTML;
}
