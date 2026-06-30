import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 * It ensures execution only happens within a browser environment.
 *
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string or an empty string if not in a DOM environment.
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(html);
};
