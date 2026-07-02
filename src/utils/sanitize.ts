import DOMPurify from 'dompurify';

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 * Uses DOMPurify but ensures it only runs in a browser environment.
 * @param html The raw HTML string to sanitize
 * @returns The sanitized HTML string, or an empty string if in a non-browser environment
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Return empty string in SSR/Node environments to prevent errors
  }
  return DOMPurify.sanitize(html);
};
