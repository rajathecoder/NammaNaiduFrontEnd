import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(html);
};
