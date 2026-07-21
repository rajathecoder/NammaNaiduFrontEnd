import DOMPurify from 'dompurify';

export const sanitizeHTML = (content: string) => {
  return DOMPurify.sanitize(content);
};
