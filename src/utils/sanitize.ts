import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string using DOMPurify to prevent XSS attacks.
 * Designed to be used with `dangerouslySetInnerHTML`.
 *
 * @param html The unsafe HTML string
 * @returns The sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
