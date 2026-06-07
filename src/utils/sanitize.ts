import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return ''; // Secure default for SSR if dompurify doesn't run
  }
  return DOMPurify.sanitize(html);
};
