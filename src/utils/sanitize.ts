/**
 * Custom DOMParser-based HTML Sanitizer
 * Mitigates XSS vulnerabilities by stripping forbidden tags and attributes,
 * and carefully parsing content.
 */

// Allow basic formatting, lists, tables, and links.
// Note: 'html', 'head', 'body' are allowed to support Node.js/jsdom DOM traversal which wraps the document.
const ALLOWED_TAGS = new Set([
  'html', 'head', 'body', // For JSDOM/DOMParser traversal
  'b', 'i', 'em', 'strong', 'a',
  'p', 'br', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'span', 'div', 'blockquote', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
]);

// Allow basic non-event attributes
const ALLOWED_ATTRIBUTES = new Set([
  'href', 'title', 'target', 'rel', 'class', 'style', 'id', 'dir', 'lang', 'src', 'alt'
]);

/**
 * Sanitizes HTML string to prevent XSS.
 * @param html Unsanitized HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  try {
    if (typeof window === 'undefined') return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const cleanNode = (node: Node) => {
      // Allow text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return;
      }

      // If it's an Element, check tag and attributes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();

        // 1. Tag validation
        if (!ALLOWED_TAGS.has(tagName)) {
          // Remove the element completely
          el.parentNode?.removeChild(el);
          return; // Stop processing this node
        }

        // 2. Attribute validation
        const attributesToRemove: string[] = [];
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          const attrName = attr.name.toLowerCase();

          // Remove control characters, null bytes, and unicode replacement characters from the value
          // eslint-disable-next-line no-control-regex
          const attrValue = attr.value.replace(/[\x00-\x1F\uFFFD]/g, '');

          // Check if attribute is allowed and does not start with 'on' (event handlers)
          if (!ALLOWED_ATTRIBUTES.has(attrName) || attrName.startsWith('on')) {
             attributesToRemove.push(attrName);
             continue;
          }

          // Strict validation for href/src to prevent javascript:, data:, vbscript: URIs
          if (attrName === 'href' || attrName === 'src') {
             const trimmedVal = attrValue.trim().toLowerCase();
             if (trimmedVal.startsWith('javascript:') || trimmedVal.startsWith('vbscript:') || trimmedVal.startsWith('data:')) {
               attributesToRemove.push(attrName);
               continue;
             }
          }

          // Re-assign the cleaned value
          el.setAttribute(attr.name, attrValue);
        }

        // Remove invalid attributes
        attributesToRemove.forEach(attrName => {
          el.removeAttribute(attrName);
        });

        // Process children recursively
        // Note: we iterate backwards because we might be removing nodes
        // (Moved inside the element block where 'el' is defined, though technically we could use 'node.childNodes', but 'el.childNodes' is cleaner in TS)
        const children = el.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
          cleanNode(children[i]);
        }
      }
    };

    cleanNode(doc.documentElement);

    // Return the sanitized inner HTML of the body
    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Fail closed: return empty string on error
    return '';
  }
};
