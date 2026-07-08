import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML to prevent XSS attacks when rendering via dangerouslySetInnerHTML.
 * @param html The dirty HTML string
 * @returns The sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
