import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 * Wraps DOMPurify.sanitize().
 *
 * @param html The untrusted HTML string
 * @returns The sanitized, safe HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
