import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
