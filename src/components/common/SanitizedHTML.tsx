import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

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
