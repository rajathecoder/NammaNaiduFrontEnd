import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS vulnerabilities.
 * Utilizes the established DOMPurify library.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html);
  }

  // Fallback for non-browser environments (e.g. Node/SSR)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on[a-z]+="[^"]*"/gi, '')
    .replace(/\s+on[a-z]+='[^']*'/gi, '');
};
