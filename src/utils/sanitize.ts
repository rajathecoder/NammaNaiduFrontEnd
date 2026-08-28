/**
 * Custom HTML Sanitizer Fallback
 * Removes script tags, object, embed, iframe, form, math, and svg elements.
 * Strips on* event handlers and javascript: URIs.
 */
export function sanitizeHTML(dirtyHTML: string): string {
  if (!dirtyHTML) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHTML, 'text/html');

  // Remove dangerous tags
  const tagsToRemove = ['script', 'iframe', 'form', 'svg', 'math', 'object', 'embed'];
  tagsToRemove.forEach((tag) => {
    const elements = doc.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i]);
    }
  });

  // Clean attributes
  const allElements = doc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const attrs = el.attributes;
    for (let j = attrs.length - 1; j >= 0; j--) {
      const attr = attrs[j];
      const attrName = attr.name.toLowerCase();

      // Remove on* event handlers
      if (attrName.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }

      // Check URL attributes
      if (['href', 'src', 'action', 'srcdoc'].includes(attrName)) {
        // eslint-disable-next-line no-control-regex
        const cleanValue = attr.value.replace(/[\x00-\x1f\ufffd]/g, '').trim().toLowerCase();
        if (cleanValue.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    }
  }

  return doc.body.innerHTML;
}
