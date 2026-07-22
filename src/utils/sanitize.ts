import DOMPurify from 'dompurify';
export const sanitizeHTML = (html: string) => DOMPurify.sanitize(html);