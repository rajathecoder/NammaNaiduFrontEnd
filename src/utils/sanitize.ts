import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string using DOMPurify to prevent XSS attacks.
 * Includes a safety check for non-browser environments.
 *
 * @param dirty - The untrusted HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHTML = (dirty: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Return safe default in SSR or non-browser environments
  }
  return DOMPurify.sanitize(dirty);
};
