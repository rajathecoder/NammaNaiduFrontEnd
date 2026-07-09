import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty: string): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'br', 'span', 'div', 'img', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style']
  });
};
