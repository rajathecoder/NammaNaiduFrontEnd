export function sanitizeHtml(htmlString: string): string {
  if (!htmlString) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Clean attributes
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((element) => {
    const attributes = element.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      const attrName = attr.name.toLowerCase();

      // Remove inline event handlers
      if (attrName.startsWith('on')) {
        element.removeAttribute(attrName);
        continue;
      }

      // Check for javascript: URIs in href and src
      if (attrName === 'href' || attrName === 'src') {
        const attrValue = attr.value;
        // eslint-disable-next-line no-control-regex
        const cleanValue = attrValue.replace(/[\x00-\x1F\x7F-\x9F\ufffd]/g, '').trim().toLowerCase();

        if (cleanValue.startsWith('javascript:')) {
          element.removeAttribute(attrName);
        }
      }
    }
  });

  return doc.body.innerHTML;
}
