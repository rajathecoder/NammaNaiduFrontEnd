import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent Cross-Site Scripting (XSS) attacks.
 * It uses DOMPurify to strip out malicious scripts while preserving safe HTML structure.
 *
 * @param {string} html - The raw, potentially unsafe HTML string.
 * @returns {string} The sanitized, safe HTML string. Returns empty string if execution is not in browser context.
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // DOMPurify requires a DOM environment.
    // Return empty string in SSR environments to be safe.
    return '';
  }
  return DOMPurify.sanitize(html);
};
