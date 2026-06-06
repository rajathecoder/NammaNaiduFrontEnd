import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks when using dangerouslySetInnerHTML.
 * Uses DOMPurify under the hood, which strips out unsafe tags like <script> and
 * harmful attributes like onclick.
 *
 * @param html - The unsanitized HTML string
 * @returns The sanitized HTML string safe for rendering
 */
export const sanitizeHTML = (html: string | undefined): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html);
};
