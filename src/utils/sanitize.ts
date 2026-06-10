import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string to prevent XSS vulnerabilities.
 * It uses DOMPurify which requires a DOM environment.
 * If running in a non-browser environment (e.g. SSR), it returns an empty string safely.
 *
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string, or an empty string if window is undefined.
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(html);
};
