import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html);
  }

  // Basic fallback for SSR (strips out <script> tags minimally, but usually SSR isn't parsing this for execution directly)
  // Or just return the raw HTML if you're sure SSR won't execute it
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
