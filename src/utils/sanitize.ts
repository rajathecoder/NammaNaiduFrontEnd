import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return html; // Return as-is if SSR
  }
  return DOMPurify.sanitize(html);
};
