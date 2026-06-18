import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses DOMPurify internally.
 * Safe for use in Server-Side Rendering (SSR) environments.
 *
 * @param html The raw, potentially unsafe HTML string
 * @returns A sanitized HTML string safe for injection
 */
export const sanitizeHTML = (html: string | undefined | null): string => {
  if (!html) return '';

  // Handle SSR environments where window is not available
  if (typeof window === 'undefined') {
    return '';
  }

  // Sanitize using DOMPurify
  return DOMPurify.sanitize(html);
};
