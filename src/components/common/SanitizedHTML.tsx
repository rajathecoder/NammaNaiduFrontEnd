import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  // 🛡️ Sentinel Security Enhancement:
  // Sanitize the HTML string using DOMPurify before injecting it via dangerouslySetInnerHTML.
  // This prevents XSS attacks if the content contains malicious scripts.
  const cleanHTML = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default SanitizedHTML;
