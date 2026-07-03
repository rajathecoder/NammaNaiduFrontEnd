import DOMPurify from 'dompurify';

/**
 * Safely sanitizes an HTML string to prevent XSS attacks.
 * It uses DOMPurify and checks for the window object to handle SSR environments gracefully.
 *
 * @param dirty - The raw, potentially unsafe HTML string
 * @returns The sanitized, safe HTML string, or an empty string in non-DOM environments
 */
export const sanitizeHTML = (dirty: string): string => {
  if (typeof window === 'undefined') {
    // DOMPurify requires a DOM, so in SSR environments (like initial Next.js/Node renders if applicable),
    // it's safer to return an empty string or basic string rather than raw HTML.
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'br', 'span', 'div', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'style'],
  });
};
