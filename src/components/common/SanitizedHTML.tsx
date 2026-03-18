import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

export const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  const sanitized = DOMPurify.sanitize(html);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default SanitizedHTML;
