export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // Basic regex fallback for SSR if DOMParser is unavailable (not ideal but better than nothing)
    let safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    safe = safe.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    safe = safe.replace(/on\w+="[^"]*"/gi, '');
    safe = safe.replace(/on\w+='[^']*'/gi, '');
    safe = safe.replace(/javascript:/gi, '');
    return safe;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      // Remove malicious tags
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'script' || tagName === 'iframe' || tagName === 'object' || tagName === 'embed') {
        el.remove();
        return;
      }

      // Remove inline event handlers (on*) and javascript: URIs
      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
        } else if (attr.value.toLowerCase().includes('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    }

    // Recursively clean child nodes
    const children = Array.from(node.childNodes);
    for (const child of children) {
      cleanNode(child);
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
};
