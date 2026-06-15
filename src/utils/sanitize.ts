import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(dirty);
};
