import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * 🛡️ Security Component: SanitizedHTML
 * Safely renders HTML content by sanitizing it with DOMPurify to prevent XSS attacks.
 * Replaces direct usage of dangerouslySetInnerHTML.
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
