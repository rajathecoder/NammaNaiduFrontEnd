import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS vulnerabilities.
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string safe for use in dangerouslySetInnerHTML.
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html);
};
