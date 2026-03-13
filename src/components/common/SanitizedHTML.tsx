import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * A reusable component that safely renders HTML content by sanitizing it first
 * to prevent Cross-Site Scripting (XSS) vulnerabilities.
 */
const SanitizedHTML = ({ html, className }: SanitizedHTMLProps) => {
  // Sanitize the HTML string to remove any potentially malicious scripts or tags
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;
