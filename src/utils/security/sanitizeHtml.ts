/**
 * 🛡️ Sentinel: Custom HTML Sanitizer
 * Strips potentially dangerous tags and attributes from HTML content.
 */

const ALLOWED_TAGS = new Set([
  'html', 'head', 'body', // Required for DOMParser to work properly without failing
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
  'strong', 'em', 'b', 'i', 'u', 's', 'span', 'div',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'a', 'img', 'video', 'audio', 'source', 'iframe',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'article', 'section', 'nav', 'main', 'header', 'footer', 'aside',
  'figure', 'figcaption', 'blockquote', 'q', 'cite',
  'code', 'pre', 'kbd', 'samp', 'var'
]);

const ALLOWED_ATTRIBUTES = new Set([
  'id', 'class', 'style', 'title', 'lang', 'dir',
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height', 'loading', 'controls', 'autoplay', 'loop', 'muted', 'poster',
  'frameborder', 'allow', 'allowfullscreen',
  'colspan', 'rowspan', 'headers', 'scope'
]);

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return ''; // SSR Guard: Fail securely
  }

  if (!html) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const traverse = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          el.remove();
          return;
        }

        // Check attributes
        const attributesToRemove: string[] = [];
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          const attrName = attr.name.toLowerCase();

          if (attrName === 'srcdoc' && tagName === 'iframe') {
            attributesToRemove.push(attr.name);
            continue;
          }

          if (attrName.startsWith('on')) {
            attributesToRemove.push(attr.name);
            continue;
          }

          if (!ALLOWED_ATTRIBUTES.has(attrName)) {
            attributesToRemove.push(attr.name);
            continue;
          }

          // Check URI attributes for bad schemes
          if (['href', 'src', 'data', 'poster'].includes(attrName)) {
            // eslint-disable-next-line no-control-regex
            const value = attr.value.replace(/[\x00-\x1F\s]/g, '').toLowerCase();
            if (
              value.startsWith('javascript:') ||
              value.startsWith('data:') ||
              value.startsWith('vbscript:') ||
              value.startsWith('file:')
            ) {
              attributesToRemove.push(attr.name);
            }
          }
        }

        attributesToRemove.forEach(attrName => el.removeAttribute(attrName));

        // Traverse children
        const children = Array.from(el.childNodes);
        children.forEach(traverse);
      }
    };

    Array.from(doc.body.childNodes).forEach(traverse);
    return doc.body.innerHTML;
  } catch (e) {
    console.error('HTML Sanitization error', e);
    return ''; // Fail securely on parse error
  }
}
