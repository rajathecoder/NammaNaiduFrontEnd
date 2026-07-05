import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks when using dangerouslySetInnerHTML.
 *
 * @param html The raw HTML string to sanitize
 * @returns A safe HTML string
 */
export const sanitizeHTML = (html: string | undefined | null): string => {
  if (!html) return '';

  // Configure DOMPurify options if needed.
  // By default, it strips out script tags and malicious attributes.
  return DOMPurify.sanitize(html);
};
