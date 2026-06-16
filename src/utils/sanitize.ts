import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 * Since DOMPurify requires a DOM environment, it checks if window is defined.
 * If running in a non-browser environment (like SSR), it returns an empty string.
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(html);
};
