import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {

  return DOMPurify.sanitize(html);
};
