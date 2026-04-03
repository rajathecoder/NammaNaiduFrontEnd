import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * 🛡️ Sentinel: SanitizedHTML Component
 * Safely renders HTML content using DOMPurify to prevent XSS attacks.
 * Use this component instead of dangerouslySetInnerHTML for rendering dynamic CMS content.
 */
const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  const sanitizedHTML = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SanitizedHTML;
