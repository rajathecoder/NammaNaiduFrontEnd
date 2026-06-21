import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Safe default for SSR environments
  }
  return DOMPurify.sanitize(html);
};
