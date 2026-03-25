import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  // Use DOMPurify to sanitize the incoming HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;
