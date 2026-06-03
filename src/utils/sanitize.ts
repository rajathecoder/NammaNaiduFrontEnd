import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS vulnerabilities.
 * @param html The raw HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
