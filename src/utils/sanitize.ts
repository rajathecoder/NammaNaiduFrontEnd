export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Recursively clean elements
  const cleanElement = (element: Element) => {
    // Remove all on* event handlers
    const attributes = Array.from(element.attributes);
    attributes.forEach((attr) => {
      if (attr.name.toLowerCase().startsWith('on')) {
        element.removeAttribute(attr.name);
      }

      // Aggressively strip href and src attributes containing javascript: URIs
      if ((attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') &&
          attr.value.toLowerCase().replace(/\s+/g, '').startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    });

    // Clean child elements
    Array.from(element.children).forEach(cleanElement);
  };

  cleanElement(doc.body);

  return doc.body.innerHTML;
};
