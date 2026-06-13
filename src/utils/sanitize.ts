import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * Uses DOMPurify under the hood. In SSR environments, it returns an empty string
 * to prevent hydration mismatches or execution errors since DOMPurify requires a DOM.
 *
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string, safe for insertion via dangerouslySetInnerHTML.
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Return safe default for SSR environments
  }

  if (!html) {
    return '';
  }

  // DOMPurify is configured to run automatically with safe defaults
  return DOMPurify.sanitize(html);
};
