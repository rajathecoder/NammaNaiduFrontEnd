import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 *
 * If running in an SSR environment where DOMPurify (which requires a DOM)
 * is unavailable, it gracefully returns an empty string to ensure safety.
 *
 * @param html - The untrusted HTML string
 * @returns A safe, sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(html);
};
