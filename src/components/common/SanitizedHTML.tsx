import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * 🛡️ Sentinel Security Enhancement:
 * Safely renders HTML content using DOMPurify to prevent XSS vulnerabilities.
 * Use this component instead of raw dangerouslySetInnerHTML for any user-generated
 * or externally-sourced HTML content (e.g., CMS pages).
 */
const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;
